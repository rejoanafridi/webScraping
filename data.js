const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the website
  const baseurl = 'https://www.startech.com.bd/component';

  const totalPages = 20;

  const allProducts = [];

  for (let i = 1; i <= totalPages; i++) {
    const url = `${baseurl}?limit=90&page=${i}`;
    await page.goto(url);
    const productsOnPage = await page.$$eval('.p-item', (productElements) => {
      return productElements.map((productElement) => {
        // Extract data as before
        const name = productElement
          .querySelector('.p-item-name a')
          .textContent.trim();

        const image = productElement
          .querySelector('.p-item-img img')
          .getAttribute('src');
        const description = productElement
          .querySelector('.short-description ul')
          .textContent.trim();
        const price = productElement
          .querySelector('.p-item-price span')
          .textContent.trim();

        return {
          name,
          image,
          description,
          price,
        };
      });
    });

    allProducts.push(...productsOnPage);
  }

  console.log(allProducts);

  // Save the products to a JSON file
  fs.writeFile(
    './products/component.json',
    JSON.stringify(allProducts),
    (err) => {
      if (err) throw err;
      console.log('File saved successfully');
    },
  );

  await browser.close();
})();
