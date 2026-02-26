
const fs = require('fs');

function cleanJson(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(content);

    // Check if keys exist in admin object
    if (data.admin) {
        // Remove the ones I added redundantly or that are confirmed duplicates
        // I noticed I added them around line 483 in en.json

        // Let's just make sure the keys we need are there and unique
        const keysToEnsure = [
            'confirmDeleteProduct',
            'productDeleted',
            'deleteProductError',
            'bulkRemoveTrendingSuccess',
            'bulkRemoveSaleSuccess',
            'confirmBulkDelete',
            'bulkDeleteProductsPartial',
            'bulkDeleteProductsSuccess',
            'bulkDeleteProductsError',
            'markedTrendingSuccess',
            'removedTrendingSuccess',
            'markedBestSellerSuccess',
            'removedBestSellerSuccess',
            'bulkBestSellerSuccess'
        ];

        // In AddProductModal (if exists)
        if (data.admin.addProductModal) {
            delete data.admin.addProductModal.confirmDeleteProduct;
            delete data.admin.addProductModal.productDeleted;
            // But keep productUpdated as it is used there
            data.admin.addProductModal.productUpdated = data.admin.addProductModal.productUpdated || "Product updated successfully";
            data.admin.addProductModal.productCreated = data.admin.addProductModal.productCreated || "Product created successfully";
        }
    }

    // Stringify and write back
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
}

// Just read the file and write it back, JSON.parse will handle duplicate keys by keeping the LAST one.
// But wait, the lint error says the JSON is invalid due to duplicates.
// Actually Node's JSON.parse allows duplicates (last one wins).
// But I should manually fix it if it's causing build errors.

cleanJson('e:/work/tele12/app/locales/en.json');
cleanJson('e:/work/tele12/app/locales/ar.json');
