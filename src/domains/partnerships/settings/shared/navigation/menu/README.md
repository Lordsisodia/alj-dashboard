# settings/shared/navigation/menu

- Builds the user-facing navigation model for Settings.
- Consumes `navigation/routing/settings-route-registry` to group, order, badge, and hide routes for menus.
- Keeps presentation concerns (labels, grouping, badges) separate from slug→component resolution.

When to edit
- Add/update menu labels, groups, badges, or visibility for settings items.
- Avoid putting component imports here—keep those in `routing`.
