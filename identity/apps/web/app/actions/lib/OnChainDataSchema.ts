export const requestSchema = {
  enum: [
    {
      struct: {
        CreateMultiSig: {
          struct: {
            permissions: {
              array: {
                type: {
                  array: {
                    type: {
                      enum: [
                        { struct: { Initiate: { struct: {} } } },
                        { struct: { Vote: { struct: {} } } },
                        { struct: { Execute: { struct: {} } } },
                      ],
                    },
                  },
                },
              },
            },
            minimum_number_of_signs_for_update: "u32",
            identity_card_hash: "string",
            multisig_account_bump: "u8",
            multisig_vault_account_bump: "u8",
          },
        },
      },
    },
    {
      struct: {
        ExecuteMultiSigAction: {
          struct: {},
        },
      },
    },
    {
      struct: {
        InitMultiSigAction: {
          struct: {
            action_id: "string",
            action: {
              enum: [
                {
                  struct: {
                    UpdateSigners: {
                      struct: {
                        signers: { map: { key: "string", value: "string" } },
                      },
                    },
                  },
                },
                {
                  struct: {
                    UpdateMinimumNumberOfSigns: { struct: { value: "u32" } },
                  },
                },
                {
                  struct: {
                    UpdateIdentityCardHash: { struct: { hash: "string" } },
                  },
                },
                { struct: { AddAssetHash: { struct: { hash: "string" } } } },
                { struct: { RemoveAssetHash: { struct: { hash: "string" } } } },
                { struct: { Delete: { struct: {} } } },
              ],
            },
            multisig_action_account_bump: "u8",
            multisig_voting_account_bump: "u8",
            in_progress_multisig_account_bump: "u8",
          },
        },
      },
    },
    {
      struct: {
        VoteMultiSigAction: {
          struct: {
            vote: "bool",
          },
        },
      },
    },
  ],
};
