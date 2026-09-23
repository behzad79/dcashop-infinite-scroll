# DcaShop Infinite Scroll

A custom WordPress plugin for managing and limiting Infinite Scroll for WooCommerce products on product category archives.

The plugin extends Flatsome's native Infinite Scroll functionality and provides a controlled loading experience, a page limit, category-specific session handling, and a pagination fallback.

## Features

* 🔄 **Infinite Scroll** — Automatically loads additional WooCommerce products while scrolling.
* 📄 **Page Limit** — Limits Infinite Scroll to page 5.
* 🗂️ **Category-Specific State** — Each product category has its own Infinite Scroll session state.
* 💾 **Session-Based Storage** — Uses browser `sessionStorage` instead of storing state in the WordPress database.
* ⏹️ **Automatic Stop** — Disables Infinite Scroll after reaching the configured page limit.
* 🔢 **Pagination Fallback** — Displays the standard WooCommerce pagination after Infinite Scroll stops.
* 🔗 **Normal Pagination** — Pagination links continue to work with normal page navigation.
* ⏳ **Custom Loader** — Provides a custom full-screen loading overlay.
* 🖼️ **Custom Loading Box** — Displays the DcaShop logo inside a centered white loading box.
* ⚙️ **Animated Spinner** — Includes a CSS-based animated loading spinner.
* 📱 **Mobile Support** — Provides smaller loader elements for mobile devices.
* 🚀 **WP Rocket Compatible** — Tested with WP Rocket in the target WooCommerce environment.
* 🎨 **Standalone Assets** — CSS and JavaScript are separated from the main plugin file.

## How It Works

The plugin runs only on WooCommerce product category archives.

When a visitor scrolls through the product archive, Flatsome's native Infinite Scroll continues loading products automatically.

Infinite Scroll is limited to page 5. After page 5 has been loaded, the plugin:

1. Stops Infinite Scroll.
2. Hides the loading indicator.
3. Displays the WooCommerce pagination.
4. Stores the completed state for the current category in `sessionStorage`.
5. Allows the visitor to continue using normal pagination.

## Category-Specific Session State

The plugin creates a separate `sessionStorage` key for each product category.

This prevents reaching the page limit in one category from affecting other product categories during the same browser session.

For example:

```text
Category A → Page 5 → Infinite Scroll stops

Category B → Infinite Scroll continues normally

Category C → Infinite Scroll continues normally
```

The state is stored only in the visitor's current browser session and is not saved in the WordPress database.

## Custom Loading Interface

The plugin replaces the default loading experience with a custom loader.

The loading interface includes:

* 🌑 Full-screen dark transparent overlay
* ⬜ Centered white loading box
* 🖼️ DcaShop logo
* 🔄 Animated spinner

The loader is created dynamically with JavaScript, while its appearance and responsive behavior are controlled through the standalone CSS file.

## Screenshots

### 🖥️ Desktop

![DcaShop Infinite Scroll Desktop](screenshots/desktop-screenshot.png)

### 📱 Mobile

![DcaShop Infinite Scroll Mobile](screenshots/mobile-screenshot.png)

## Plugin Structure

```text
dcashop-infinite-scroll/
├── assets/
│   ├── css/
│   │   └── infinite-scroll.css
│   └── js/
│       └── infinite-scroll.js
├── dcashop-infinite-scroll.php
```

## Installation

1. Download or clone the repository.
2. Upload the `dcashop-infinite-scroll` folder to:

```text
/wp-content/plugins/
```

3. Activate **DcaShop Infinite Scroll** from **WordPress Admin → Plugins**.
4. Make sure Flatsome Infinite Scroll is enabled for the relevant WooCommerce archives.

## Configuration

The current maximum Infinite Scroll page is set to `5`.

The value is localized from the main plugin file:

```php
'maxPage' => 5,
```

The plugin currently applies only to WooCommerce product category archives.

## Requirements

* 🧩 WordPress
* 🛒 WooCommerce
* 🎨 Flatsome Theme
* 🔄 Flatsome Infinite Scroll
* 🌐 JavaScript-enabled browser

## Compatibility

Developed and tested on a WooCommerce website using:

* WordPress
* WooCommerce
* Flatsome
* WP Rocket

The plugin does not require modifications to Flatsome theme core files.

## Author

**Seyyed Behzad Mousaviyan**

WordPress & WooCommerce Developer

GitHub: [behzad79](https://github.com/behzad79)

## License

GPL-2.0-or-later
