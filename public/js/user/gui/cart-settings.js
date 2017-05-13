function updateQty(id) {

	var numRegex = /^[0-9]+$'/;
	const quant = $(`#quantity-${id}`).val();
	
	if (quant.length > 0) {
		var qty = parseInt(quant);

//		if (numRegex.test(qty)) {
			if (qty > 0) {

				const formData = {
					id: id,
					qty: quant
				}

				$.ajax({
					url: "/user/update/cart",
					type: "PUT",
					dataType: "json",
					data: JSON.stringify(formData),
					success: function(result) {
						$("#saved-cart-list").load(location.href + " #saved-cart-list");
						$("#total-cost").load(location.href + " #total-cost");
						$("#tax-cost").load(location.href + " #tax-cost");
						$("#net-cost").load(location.href + " #net-cost");
					},
					contentType: "application/json"
				});

			} else {
				alert("Quantity cannot be less than 1");
			}
/*		} else {
			alert("Invalid quantity. It should be numberic only.");
		}
*/	} else {
		alert("Quantity cannot be empty");
	}
}

function deleteCartItem(prod) {

	const data = {
		id: prod
	}

	$.ajax({
		url: "/user/update/cart",
		type: "DELETE",
		dataType: "json",
		data: JSON.stringify(data),
		success: function(result) {
			$("#success-cart-list").removeClass("hidden");
			$("#saved-cart-list").load(location.href + " #saved-cart-list");
			$("#cart-size").load(location.href + " #cart-size");
			
			if (result.cartSize != 0) {
				$("#total-cost").load(location.href + " #total-cost");
				$("#tax-cost").load(location.href + " #tax-cost");
				$("#net-cost").load(location.href + " #net-cost");
			} else {
				$("#summary").css("display", "none");
			}

			setTimeout(() => {
				$("#success-cart-list").addClass("hidden");
			},6000);
		},
		contentType: "application/json"
	});
}