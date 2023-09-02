const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeWebsite(url, totalPages, category) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const allProductsData = [];

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      // Generate the URL for the current page
      const pageUrl = `${url}&page=${currentPage}`;

      // Navigate to the current page
      await page.goto(pageUrl);

      // Get the list of all product items on the page
      const productItems = await page.$$('.p-item');

      for (const productItem of productItems) {
        try {
          // ... (Your existing product scraping logic here)
          const productDetails = await productItem.evaluate((element) => {
            const nameElement = element.querySelector('.p-item-name a');
            const name = nameElement ? nameElement.textContent.trim() : 'N/A';

            const imageUrlElement = element.querySelector('.p-item-img img');
            const imageUrl = imageUrlElement
              ? imageUrlElement.getAttribute('src')
              : 'N/A';

            const priceElement = element.querySelector('.price-new');
            const price = priceElement
              ? priceElement.textContent.trim()
              : 'N/A';

            const descriptionElement = element.querySelector(
              '.short-description ul',
            );
            const description = descriptionElement
              ? descriptionElement.textContent.trim()
              : 'N/A';

            return { name, imageUrl, price, description };
          });

          // Extract the product details URL
          const productDetailsUrl = await productItem.evaluate((element) => {
            const anchorTag = element.querySelector('.p-item-name a');
            return anchorTag ? anchorTag.getAttribute('href') : null;
          });

          if (productDetailsUrl) {
            const productPage = await browser.newPage();
            await productPage.goto(productDetailsUrl);
            // Get specification details
            const specificationDetails = await productPage.evaluate(() => {
              const specificationSection =
                document.querySelector('#specification');
              const rows = specificationSection
                ? specificationSection.querySelectorAll('tbody tr')
                : [];

              const specifications = {};

              rows.forEach((row) => {
                const nameElement = row.querySelector('.name');
                const valueElement = row.querySelector('.value');

                if (nameElement && valueElement) {
                  const name = nameElement.textContent.trim();
                  const value = valueElement.textContent.trim();
                  specifications[name] = value;
                }
              });

              return specifications;
            });

            const additionalDetails = await productPage.evaluate(() => {
              const productSummary = document.querySelector('.pd-summary');
              const productInfo = productSummary
                ? productSummary.querySelector('.product-short-info')
                : null;
              const keyFeatures = productSummary
                ? productSummary.querySelector('.short-description ul')
                : null;
              const paymentOptions = productSummary
                ? productSummary.querySelector('.product-price-options')
                : null;
              // ...

              const cashDiscountPrice = productInfo
                ? productInfo
                    .querySelector('.product-price ins')
                    ?.textContent.trim()
                : 'N/A';
              const regularPrice = productInfo
                ? productInfo
                    .querySelector('.product-regular-price')
                    ?.textContent.trim()
                : 'N/A';
              const status = productInfo
                ? productInfo
                    .querySelector('.product-status')
                    ?.textContent.trim()
                : 'N/A';
              const productCode = productInfo
                ? productInfo.querySelector('.product-code')?.textContent.trim()
                : 'N/A';
              const brand = productInfo
                ? productInfo
                    .querySelector('.product-brand')
                    ?.textContent.trim()
                : 'N/A';

              const keyFeaturesList = keyFeatures
                ? Array.from(keyFeatures.querySelectorAll('li')).map((item) =>
                    item.textContent.trim(),
                  )
                : [];

              return {
                cashDiscountPrice,
                regularPrice,
                status,
                productCode,
                brand,
                keyFeatures: keyFeaturesList,
              };
            });

            const productData = {
              ...productDetails,
              additionalDetails: additionalDetails,
              specifications: specificationDetails,
            };
            console.log(productData);

            allProductsData.push(productData);

            // Now you are on the product details page, you can continue with scraping.

            // ... Your existing product scraping logic here ...

            // Close the product details page
            await productPage.close();
          } else {
            console.error('Product details URL not found.');
          }
        } catch (error) {
          console.error('Error scraping product details:', error);
        }
      }
    }

    // Close the browser
    await browser.close();

    // Save all product data to a JSON file
    fs.writeFileSync(
      `./starTech/${category}.json`,
      JSON.stringify(allProductsData, null, 2),
    );

    return allProductsData;
  } catch (error) {
    console.error('Error navigating to the website:', error);
  }
}

async function scrapeProductData(productItem, browser) {
  // Your product scraping logic here
}

const categories = [
  'component',
  'laptop-notebook',
  'desktop',
  'monitor',
  'ups-ips',
  'mobile-phone',
  'tablet-pc',
  'office-equipment',
  'camera',
  'Security-Camera',
  'networking',
  'software',
  'server-networking',
  'accessories',
  'gadget',
  'gaming',
  'television-shop',
  'air-conditioner',
];

for (let type = 0; type < categories.length; type++) {
  const category = categories[type];
  const websiteUrl = `https://www.startech.com.bd/${category}?limit=50`;
  const totalPages = 2; // Change this to the desired number of total pages
  scrapeWebsite(websiteUrl, totalPages, category)
    .then((data) => {
      console.log(
        `Scraped data for ${data.length} products saved to ${category}.json`,
      );
    })
    .catch((error) => {
      console.error(error);
    });
}

// const websiteUrl = 'https://www.startech.com.bd/component?limit=90';
// const totalPages = 20; // Change this to the desired number of total pages
// scrapeWebsite(websiteUrl, totalPages)
//   .then((data) => {
//     console.log(`Scraped data for ${data.length} products saved to all_products.json`);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
