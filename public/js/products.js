document.querySelectorAll(".delete-product-btn").forEach(btn=>{
    btn.addEventListener("submit", async function (event) {
         event.preventDefault(); // Prevent full-page reload
        const productId = this.getAttribute("data-id");
        const actionUrl = this.getAttribute("action"); // Get API endpoint
        
        const isConfirmed = confirm("Are you sure you want to delete this product ?");
        if (!isConfirmed) return;
            
        const response = await fetch(actionUrl, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: productId })
        });

        if (response.ok) {
            document.getElementById(`product_row_${productId}`).closest("tr").remove(); // Correct selector
        } else {
            const result = await response.json();
            alert("Error: " + result.message);
        }
    })
})