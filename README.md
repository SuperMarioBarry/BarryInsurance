# Insurance Proposal Generator — Android PWA

This is an installable Progressive Web App designed for Android Chrome. It generates:

- a one-page red insurance proposal PNG
- a detailed 3-page PDF
- reusable proposal-data JSON files

All client calculations and document generation happen locally in the browser. No server-side client database is included.

## Recommended deployment: Netlify Drop

1. Unzip this package on a computer.
2. Go to https://app.netlify.com/drop
3. Drag the entire `insurance_proposal_pwa` folder onto the page.
4. Netlify will give you an HTTPS website address.
5. Open that website in Chrome on Android.
6. Choose **Add to Home screen** / **Install app**.

HTTPS is required for normal PWA installation and offline caching.

## Alternative deployment

You can also host the folder on GitHub Pages, Cloudflare Pages, Vercel, Firebase Hosting, or any static HTTPS web host.

## Using the app

1. Enter client and product details.
2. Enter two quotation options and premiums.
3. Set the SGD/THB exchange rate.
4. Optionally upload your logo and a family/header photo.
5. Tap **Update Preview**.
6. Tap **Download PNG** or **Download PDF**.
7. Use **Save Proposal Data** to save the inputs for later reuse.

## Notes

- The current template follows the approved red-and-white proposal style.
- PDF generation is built into the browser; there are no external JavaScript dependencies.
- Thai text can be entered. Rendering uses fonts available on the Android device/browser.
- Official policy wording, product terms and compliance text should be reviewed before client distribution.
