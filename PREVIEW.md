# Previewing modernization-v1 safely

This branch uses GitHub Codespaces as a private preview environment.

## First time, or after this preview fix

If you already created a Codespace before this fix, rebuild it so it picks up the updated setup:

1. Open the Codespace.
2. Press **Ctrl+Shift+P**.
3. Type **Rebuild Container**.
4. Choose **Codespaces: Rebuild Container**.
5. Wait for the rebuild to finish.

## Open the website

1. On GitHub, switch the repository branch to `modernization-v1`.
2. Click **Code**.
3. Open the **Codespaces** tab.
4. Open your existing Codespace, or create one on `modernization-v1`.
5. When GitHub says **Website Preview is available on port 8000**, click **Open in Browser**.

You can also open the **Ports** tab in Codespaces and click the globe icon beside **8000 — Website Preview**.

## If you see HTTP ERROR 502

The forwarded URL opened before the local preview server was available, or the Codespace is still using the older container configuration.

Rebuild the container using the steps above. Then wait for port 8000 to appear in the **Ports** tab and open it again.

## Important

- This previews only `modernization-v1`.
- It does not merge anything.
- It does not modify `main`.
- It does not change the live website.
- Closing or deleting the Codespace does not delete the branch.
