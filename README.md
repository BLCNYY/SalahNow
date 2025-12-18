<div align="center">
  <img src="./public/icons/icon.png" alt="Salah[Now] Logo" width="120" height="120">
  
# Salah[Now]

Prayer times. That's it.

![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
  ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
</div>

## 📸 Screenshots

### Desktop
| | |
|:---:|:---:|
| ![Desktop Screenshot 1](./screenshots/salahnow-screenshot-desktop-01.png) | ![Desktop Screenshot 2](./screenshots/salahnow-screenshot-desktop-02.png) |

### Mobile
| | |
|:---:|:---:|
| ![Mobile Screenshot 1](./screenshots/salahnow-screenshot-mobile-01.png) | ![Mobile Screenshot 2](./screenshots/salahnow-screenshot-mobile-02.png) |

## Features

- **Real-time countdown** - Live countdown to the next prayer time
- **Offline support** - Works great as a PWA, accessible even without internet after initial load
- **Multi-language** - Supports English, Turkish, Arabic, German, and French (and more soon)
- **Location-based** - Automatic location detection with manual selection for any city
- **Monthly calendar** - View prayer times for the entire month with Gregorian/Hijri calendar toggle
- **Starred locations** - Save your favorite locations for quick access
- **Mobile optimized** - Responsive design that works beautifully on all devices
- **Simple & fast** - Minimalist interface focused on what matters

## Run locally

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/blcnyy/salahnow.git
cd salahnow
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Accessible components
- **Hugeicons** - Beautiful icons

## 📱 PWA Support

Salah[Now] is a Progressive Web App. After visiting the site, you can:
- Install it on your device (mobile or desktop)
- Use it offline after the initial load
- Access prayer times without an internet connection

## 🌍 Supported Locations

- **Türkiye** - All 81 provinces with accurate prayer times provided by **T.C. Diyanet İşleri Başkanlığı**
- **Worldwide** - Prayer times for any city worldwide via [AlAdhan API](https://aladhan.com/prayer-times-api)

## Contribute

Please read the [Contributing guide](CONTRIBUTING.md) for setup steps, pull request expectations, and coding standards. By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

### Reporting issues

- Share a clear description of the problem or feature
- Include reproduction steps and expected versus actual behavior
- Attach screenshots or recordings when helpful

### Areas for contribution

- Translations and new language support
- UI and accessibility improvements
- Performance and offline reliability
- Bug fixes and regression tests
- Documentation updates

### Security

Please review the [Security Policy](SECURITY.md) for responsible disclosure instructions.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

Copyright (c) 2025 [Ömer Balkan](https://github.com/blcnyy)

## 🙏 Acknowledgments

- Prayer times data from [T.C. Diyanet İşleri Başkanlığı](https://diyanet.gov.tr) (Türkiye) and [AlAdhan API](https://aladhan.com) (worldwide)
- Icons from [Hugeicons](https://hugeicons.com)
