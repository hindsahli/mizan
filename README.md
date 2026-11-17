# Mizan – Bijouterie Al Andalous

Mizan is a web application developed for **Bijouterie Al Andalous** to help users follow gold and silver prices and estimate the value of their jewelry.

## Features

- **Live Metal Prices:** Display the latest gold and silver prices.
- **Price History:** Visualize gold and silver price changes using a bar chart.
- **History Filters:** Switch between gold and silver and view weekly or monthly history.
- **Currency Converter:** Display prices in USD, MAD, or EUR.
- **Jewelry Estimator:** Estimate the value of gold or silver based on its weight.
- **Automatic Updates:** Fetch the latest prices and exchange rates from external APIs.
- **Responsive Design:** Adapt the interface to different screen sizes.

## Technologies Used

- HTML5
- CSS3
- Tailwind CSS
- JavaScript (ES6 Modules)
- SVG for data visualization
- REST APIs
- Local Storage

## Project Structure

```text
Mizan/
├── index.html
├── src/
│   ├── css/
│   │   ├── input.css
│   │   └── output.css
│   └── js/
│       ├── main.js
│       ├── api.js
│       ├── state.js
│       ├── calculator.js
│       ├── render.js
│       └── storage.js
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hindsahli/mizan.git
```

### 2. Navigate to the project folder

```bash
cd Mizan
```

### 3. Run the project

Open the project using a local development server, such as the **Live Server** extension in Visual Studio Code.

Then open `index.html` in your browser through the local server.

## How It Works

1. The application fetches the latest gold and silver prices.
2. Exchange rates are retrieved to support currency conversion.
3. Users can switch between USD, MAD, and EUR.
4. Historical prices are displayed in a dynamic SVG bar chart.
5. Users can enter the weight of a jewelry item and select a metal to estimate its value.

## Author

Developed as a JavaScript project for **Bijouterie Al Andalous**.
# mizan-part-II
