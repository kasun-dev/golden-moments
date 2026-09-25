<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Use TanStack Start file routes and Lovable Cloud; this stack replaces the requested Next.js/Supabase implementation while preserving every requested URL and workflow.
- Public invitation reads and RSVP writes go through token-scoped database functions so guest tokens never expose unrelated event or guest records.
- Admin and couple pages live under the integration-managed authenticated route layout; server-side role and row policies remain the security boundary.
