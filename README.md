# LinkMe Clone

A lightweight clone of LinkMe with deep linking and overlay logic.

## How to Run
Because this project uses `fetch()` to load `data.json`, you cannot simply open `index.html` in a file browser due to security restrictions (CORS). You must run a local server.

### Using Python (Recommended)
1.  Open your terminal.
2.  Navigate to this folder:
    ```bash
    cd /Users/jakabasej/of_link_site/linkme_clone
    ```
3.  Run the simple server:
    ```bash
    python3 -m http.server
    ```
4.  Open [http://localhost:8000](http://localhost:8000) in your browser.

## Customization
-   **Content**: Edit `data.json` to change the profile info and links.
-   **Styles**: Edit `style.css` to change colors and theme.
-   **Logic**: Edit `script.js` to adjust the bounce logic or overlay behavior.
