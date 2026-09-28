# Canva asset registry

Every listed asset already has a dedicated `<img>` element, unique ID, class, and CSS treatment. The current tiny placeholder files prevent broken-image states while CSS supplies the visual fallback. Replace a file in place; do not rename its matching DOM ID unless you also update `index.html` and this registry.

| Filename | HTML element | CSS class | Layer / animation |
| --- | --- | --- | --- |
| `images/loading-ornament.png` | `#loading-ornament` | `.loading-ornament-asset` | Center / ornament breathe |
| `images/welcome-sky.webp` | `#welcome-sky` | `.welcome-sky-asset` | Welcome back / sky drift |
| `images/welcome-palace.png` | `#welcome-palace` | `.welcome-palace-asset` | Welcome middle / palace arrive |
| `images/welcome-foreground.png` | `#welcome-foreground` | `.welcome-foreground-asset` | Welcome front / foreground sway |
| `images/couple-intro-frame.png` | `#couple-intro-frame` | `.couple-intro-frame-asset` | Couple frame / reveal |
| `images/palace-sky.webp` | `#palace-sky` | `.palace-sky-asset` | Transition back / parallax 0.05 |
| `images/palace-distant.png` | `#palace-distant` | `.palace-distant-asset` | Transition distant / parallax 0.10 |
| `images/palace-main.png` | `#palace-main` | `.palace-main-asset` | Transition palace / parallax 0.16 |
| `images/palace-arch.png` | `#palace-arch` | `.palace-arch-asset` | Transition foreground / parallax 0.12 |
| `images/garden-background.webp` | `#garden-background` | `.garden-background-asset` | Transition garden / parallax 0.22 |
| `images/garden-foreground.png` | `#garden-foreground` | `.garden-foreground-asset` | Transition foreground / parallax 0.30 |
| `images/lantern.png` | `#palace-lantern` | `.palace-lantern-asset` | Transition accent / lantern glow |
| `images/floating-petals.png` | `#floating-petals` | `.floating-petals-asset` | Transition top / petals float + parallax 0.18 |
| `images/nikah-hall-background.webp` | `#nikah-hall-background` | `.nikah-hall-background-asset` | Hall back / scene reveal |
| `images/nikah-hall-floor.png` | `#nikah-hall-floor` | `.nikah-hall-floor-asset` | Hall floor / scene reveal |
| `images/groom-nikah.png` | `#groom-nikah` | `.groom-nikah-asset` | Hall character / left settle |
| `images/bride-nikah.png` | `#bride-nikah` | `.bride-nikah-asset` | Hall character / right settle |
| `images/hall-floral-decor.png` | `#hall-floral-decor` | `.hall-floral-decor-asset` | Hall floral / scene reveal |
| `images/prayer-background.webp` | `#prayer-background` | `.prayer-background-asset` | Prayer back / scene reveal |
| `images/prayer-arch.png` | `#prayer-arch` | `.prayer-arch-asset` | Prayer arch / scene reveal |
| `images/couple-prayer.png` | `#couple-prayer` | `.couple-prayer-asset` | Prayer couple / upward reveal |
| `images/prayer-light.png` | `#prayer-light` | `.prayer-light-asset` | Prayer light / light breathe |
| `images/scratch-overlay.png` | `#scratch-overlay` | `.scratch-overlay-asset` | Scratch texture / canvas reveal |
| `images/scratch-border.png` | `#scratch-border` | `.scratch-border-asset` | Scratch border / static layer |
| `images/scratch-decoration.png` | `#scratch-decoration` | `.scratch-decoration-asset` | Scratch decoration / static layer |
| `images/events-background.webp` | `#events-background` | `.events-background-asset` | Events back / scene reveal |
| `images/haldi-icon.svg` | `#haldi-icon` | `.haldi-icon-asset` | Haldi card / staggered reveal |
| `images/mehndi-icon.svg` | `#mehndi-icon` | `.mehndi-icon-asset` | Mehndi card / staggered reveal |
| `images/nikah-icon.svg` | `#nikah-icon` | `.nikah-icon-asset` | Nikah card / staggered reveal |
| `images/walima-icon.svg` | `#walima-icon` | `.walima-icon-asset` | Walima card / staggered reveal |
| `images/countdown-background.webp` | `#countdown-background` | `.countdown-background-asset` | Countdown back / scene reveal |
| `images/countdown-ornament.png` | `#countdown-ornament` | `.countdown-ornament-asset` | Countdown detail / slow turn |
| `images/host-card-frame.png` | `#host-card-frame` | `.host-card-frame-asset` | Hosts frame / static layer |
| `images/hosts-background.webp` | `#hosts-background` | `.hosts-background-asset` | Hosts back / scene reveal |
| `images/blessing-background.webp` | `#blessing-background` | `.blessing-background-asset` | Blessing back / scene reveal |
| `images/blessing-ornament.png` | `#blessing-ornament` | `.blessing-ornament-asset` | Blessing ornament / slow turn |
| `images/names-background.webp` | `#names-background` | `.names-background-asset` | Final back / scene reveal |
| `images/names-floral-border.png` | `#names-floral-border` | `.names-floral-border-asset` | Final border / static layer |
| `images/gold-sparkles.png` | `#gold-sparkles` | `.gold-sparkles-asset` | Final sparkles / gold drift |
| `icons/menu-icon.svg` | `#menu-icon` | `.menu-icon-asset` | Fixed menu control |
| `icons/music-icon.svg` | `#music-icon` | `.music-icon-asset` | Fixed music control / pulse while playing |
| `icons/scroll-indicator.svg` | `#scroll-indicator` | `.scroll-indicator-asset` | Welcome cue / scroll gesture |

`audio/nasheed.mp3` is intentionally optional. Add an appropriately licensed MP3 at that exact path to enable the music control; browser playback begins only after the visitor interacts with the invitation.
