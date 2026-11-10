# Google Drive → KARIM SAAB — pending secrets and a safe activation test

Date: 2026-11-10

## Verified state
The scheduled action `Sync approved content from Google Drive` failed in its `Check required GitHub secrets` step: https://github.com/alsaabb/KARIM-SAAB-WEB-LAB/actions/runs/42770619546

The following repository Actions secrets are required:

- `GDRIVE_SERVICE_ACCOUNT_KEY`: service account JSON key with **minimum read-only Drive access** to the selected approved content folder(s).
- `GDRIVE_FOLDER_ID`: exact Drive folder identifier for the approved *site sync source* (not an arbitrary parent, and not necessarily the `من أنا` section folder for the entire site).

**Never commit the credential, include it in logs, paste it in public issues, or change existing Drive sharing permissions without separate approval.** The site currently renders a static snapshot; its source documents can remain private in Drive.

## Safe activation
1. Owner chooses the precise approved source tree and grants the automation identity only the access it requires.
2. Owner stores secrets in GitHub → repository Settings → Secrets and variables → Actions. (This ChatGPT GitHub connector does not provide a secret-write action.)
3. Run the action manually on a staging branch or in a read-only preview first, compare generated files, verify the approval flags, and confirm no deletion or replacement of unrelated files.
4. Only after inspection, permit the live workflow and document its successful run.

Until step 4, mark Drive sync **BLOCKED — NOT ACTIVE**; do not confuse static Drive-source links with automatic synchronization.
