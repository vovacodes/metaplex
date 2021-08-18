import {
  useConnection,
  setProgramIds,
  useConnectionConfig,
  AUCTION_ID,
  METAPLEX_ID,
  VAULT_ID,
  METADATA_PROGRAM_ID,
  toPublicKey,
} from '@oyster/common';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MetaState, MetaContextState, UpdateStateValueFunc } from './types';
import { queryExtendedMetadata } from './queryExtendedMetadata';
import { processAuctions } from './processAuctions';
import { processMetaplexAccounts } from './processMetaplexAccounts';
import { processMetaData } from './processMetaData';
import { processVaultData } from './processVaultData';
import {
  loadAccounts,
  makeSetter,
  metadataByMintUpdater,
} from './loadAccounts';
import { onChangeAccount } from './onChangeAccount';
import { getHandleAndRegistryKey } from '@solana/spl-name-service';
import { PublicKey } from '@solana/web3.js';
import produce from 'immer';

const MetaContext = React.createContext<MetaContextState>({
  metadata: [],
  metadataByMint: {},
  masterEditions: {},
  masterEditionsByPrintingMint: {},
  masterEditionsByOneTimeAuthMint: {},
  metadataByMasterEdition: {},
  editions: {},
  auctionManagersByAuction: {},
  auctions: {},
  auctionDataExtended: {},
  vaults: {},
  store: null,
  isLoading: false,
  bidderMetadataByAuctionAndBidder: {},
  safetyDepositBoxesByVaultAndIndex: {},
  safetyDepositConfigsByAuctionManagerAndIndex: {},
  bidRedemptionV2sByAuctionManagerAndWinningIndex: {},
  bidderPotsByAuctionAndBidder: {},
  bidRedemptions: {},
  whitelistedCreatorsByCreator: {},
  twitterHandlesByCreator: {},
  payoutTickets: {},
  prizeTrackingTickets: {},
  stores: {},
});

export function MetaProvider({ children = null as any }) {
  const connection = useConnection();
  const { env } = useConnectionConfig();
  const urlParams = new URLSearchParams(window.location.search);
  const all = urlParams.get('all') == 'true';

  const [state, setState] = useState<MetaState>({
    metadata: [],
    metadataByMint: {},
    masterEditions: {},
    masterEditionsByPrintingMint: {},
    masterEditionsByOneTimeAuthMint: {},
    metadataByMasterEdition: {},
    editions: {},
    auctionManagersByAuction: {},
    bidRedemptions: {},
    auctions: {},
    auctionDataExtended: {},
    vaults: {},
    payoutTickets: {},
    store: null,
    whitelistedCreatorsByCreator: {},
    twitterHandlesByCreator: {},
    bidderMetadataByAuctionAndBidder: {},
    bidderPotsByAuctionAndBidder: {},
    safetyDepositBoxesByVaultAndIndex: {},
    prizeTrackingTickets: {},
    safetyDepositConfigsByAuctionManagerAndIndex: {},
    bidRedemptionV2sByAuctionManagerAndWinningIndex: {},
    stores: {},
  });

  const [isLoading, setIsLoading] = useState(true);

  const updateMints = useCallback(
    async metadataByMint => {
      try {
        if (!all) {
          const { metadata, mintToMetadata } = await queryExtendedMetadata(
            connection,
            metadataByMint,
          );
          setState(current => ({
            ...current,
            metadata,
            metadataByMint: mintToMetadata,
          }));
        }
      } catch (er) {
        console.error(er);
      }
    },
    [setState],
  );

  useEffect(() => {
    (async () => {
      await setProgramIds(env);

      console.log('-----> Query started');

      const nextState = await loadAccounts(connection, all);

      console.log('------->Query finished');

      setState(nextState);

      setIsLoading(false);
      console.log('------->set finished');

      updateMints(nextState.metadataByMint);
    })();
  }, [connection, setState, updateMints, env]);

  const updateStateValue = useMemo<UpdateStateValueFunc>(
    () => (prop, key, value) => {
      setState(current => makeSetter({ ...current })(prop, key, value));
    },
    [setState],
  );

  const { store, whitelistedCreatorsByCreator, twitterHandlesByCreator } =
    state;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const vaultSubId = connection.onProgramAccountChange(
      toPublicKey(VAULT_ID),
      onChangeAccount(processVaultData, updateStateValue, all),
    );

    const auctionSubId = connection.onProgramAccountChange(
      toPublicKey(AUCTION_ID),
      onChangeAccount(processAuctions, updateStateValue, all),
    );

    const metaplexSubId = connection.onProgramAccountChange(
      toPublicKey(METAPLEX_ID),
      onChangeAccount(processMetaplexAccounts, updateStateValue, all),
    );

    const metaSubId = connection.onProgramAccountChange(
      toPublicKey(METADATA_PROGRAM_ID),
      onChangeAccount(
        processMetaData,
        async (prop, key, value) => {
          if (prop === 'metadataByMint') {
            const nextState = await metadataByMintUpdater(value, state, all);
            setState(nextState);
          } else {
            updateStateValue(prop, key, value);
          }
        },
        all,
      ),
    );

    return () => {
      connection.removeProgramAccountChangeListener(vaultSubId);
      connection.removeProgramAccountChangeListener(metaplexSubId);
      connection.removeProgramAccountChangeListener(metaSubId);
      connection.removeProgramAccountChangeListener(auctionSubId);
    };
  }, [
    connection,
    updateStateValue,
    setState,
    store,
    whitelistedCreatorsByCreator,
    isLoading,
  ]);

  useEffect(() => {
    let active = true;
    (async () => {
      const creatorsToResolve = Object.keys(
        whitelistedCreatorsByCreator,
      ).filter(creator => !twitterHandlesByCreator.hasOwnProperty(creator));

      if (creatorsToResolve.length === 0) return;

      const entries = await Promise.all(
        creatorsToResolve.map(creatorAddr =>
          getHandleAndRegistryKey(connection, new PublicKey(creatorAddr)).then(
            ([handle]) => [creatorAddr, '@' + handle] as const,
            _err => [creatorAddr, null] as const,
          ),
        ),
      );

      if (!active) return;

      setState(prevState => {
        return produce(prevState, draft => {
          for (const [creator, handle] of entries) {
            draft.twitterHandlesByCreator[creator] = handle;
            draft.whitelistedCreatorsByCreator[creator].info.twitter =
              handle ?? undefined;
          }
        });
      });
    })();

    return () => {
      active = false;
    };
  }, [whitelistedCreatorsByCreator, twitterHandlesByCreator, setState]);

  return (
    <MetaContext.Provider
      value={{
        ...state,
        isLoading,
      }}
    >
      {children}
    </MetaContext.Provider>
  );
}

export const useMeta = () => {
  const context = useContext(MetaContext);
  return context;
};
