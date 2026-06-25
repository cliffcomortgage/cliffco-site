<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog integration for the Cliffco MN microsite. A `src/components/posthog.astro` snippet component was created and imported into `src/pages/index.astro` via the `<head>`. A single `is:inline` event-capture script was added before `</body>` to attach click listeners for all five tracked actions using `window.posthog?.capture()`. Environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` were added to `.env`, and `posthog-js` was added as a dependency.

| Event | Description | File |
|---|---|---|
| `get_approved_clicked` | User clicked a "Get Approved" CTA button linking to the mortgage portal | `src/pages/index.astro` |
| `phone_clicked` | User clicked the click-to-call link to reach Mitch Patterson | `src/pages/index.astro` |
| `email_clicked` | User clicked the email link to contact Mitch Patterson | `src/pages/index.astro` |
| `nmls_verify_clicked` | User clicked through to verify Mitch Patterson's NMLS license | `src/pages/index.astro` |
| `full_site_visited` | User clicked the "Visit Full Site" link in the footer | `src/pages/index.astro` |

## Next steps

A dashboard and insights have been created in PostHog to monitor conversion behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/485832/dashboard/1760333)
- [Get Approved clicks over time](https://us.posthog.com/project/485832/insights/rrIou8pJ)
- [Phone and email clicks](https://us.posthog.com/project/485832/insights/kmTaYpG8)
- [Total conversions (30 days)](https://us.posthog.com/project/485832/insights/4sMltngf)
- [All lead actions by type](https://us.posthog.com/project/485832/insights/9YKPqOER)
- [Full site exit rate](https://us.posthog.com/project/485832/insights/FfdondqJ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any deployment configuration (e.g., Vercel environment variables) so the token is available in production.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
