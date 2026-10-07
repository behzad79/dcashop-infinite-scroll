jQuery(function($) {

	var dcashopMaxPage = 5;

	var categoryKey = window.location.pathname
		.replace(/\/+$/, '')
		.replace(/[^a-zA-Z0-9_-]/g, '_');

	var dcashopStorageKey =
		'dcashop_infinite_scroll_finished_' + categoryKey;

	var dcashopInfiniteFinished =
		sessionStorage.getItem(
			dcashopStorageKey
		) === '1';


	/* Loader */

	function dcashopShowLoader() {

		var $loader =
			$('.loader-image.infinite-scroll-request');

		if (!$loader.length) {
			return;
		}

		if (!$loader.find('.dcis-loader-box').length) {

			var $logo =
				$loader.find('.archive-img-loader').first();

			$logo.wrap(
				'<div class="dcis-loader-box"></div>'
			);

			$logo.after(
				'<div class="dcis-loader-spinner"></div>'
			);
		}

		$loader[0].style.setProperty(
			'display',
			'flex',
			'important'
		);
	}


	function dcashopHideLoader() {

		$('.loader-image.infinite-scroll-request')
			.attr(
				'style',
				'display: none !important;'
			);
	}


	/* Bottom spinner */

	function dcashopShowBottomSpinner() {

		var $products = $('.products');

		if (!$products.length) {
			return;
		}

		if (!$products.next('.dcis-bottom-spinner').length) {

			$products.after(
				'<div class="dcis-bottom-spinner">' +
					'<div class="dcis-bottom-spinner-circle"></div>' +
				'</div>'
			);
		}

		$products
			.next('.dcis-bottom-spinner')
			.show();
	}


	function dcashopHideBottomSpinner() {

		$('.dcis-bottom-spinner').hide();
	}


	/* Disable infinite scroll */

	function dcashopDisableInfiniteScroll() {

		var $products = $('.products');

		var dc =
			$products.data(
				'infiniteScroll'
			);

		if (dc) {

			try {
				dc.destroy();
			} catch (e) {}

		}

		dcashopHideLoader();
		dcashopHideBottomSpinner();

		$('.woocommerce-pagination')
			.attr(
				'style',
				'display: block !important;'
			);
	}


	/* Pagination click */

	document.addEventListener(
		'click',
		function(e) {

			if (!dcashopInfiniteFinished) {
				return;
			}

			var link =
				e.target.closest(
					'.woocommerce-pagination a'
				);

			if (!link) {
				return;
			}

			var href =
				link.getAttribute('href');

			if (!href || href === '#') {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			window.location.href = href;

		},
		true
	);


	/* Check finished state */

	if (dcashopInfiniteFinished) {

		var dcashopDisableWait =
			setInterval(
				function() {

					var dc =
						$('.products')
							.data(
								'infiniteScroll'
							);

					if (dc) {

						clearInterval(
							dcashopDisableWait
						);

						dcashopDisableInfiniteScroll();

					}

				},
				200
			);

		$('.woocommerce-pagination')
			.attr(
				'style',
				'display: block !important;'
			);

		return;
	}


	/* Find Flatsome infinite scroll */

	var dcashopWait =
		setInterval(
			function() {

				var $products = $('.products');

				var dc =
					$products.data(
						'infiniteScroll'
					);

				if (!dc) {
					return;
				}

				clearInterval(dcashopWait);


				/* Limit pages */

				var originalPath =
					dc.options.path;

				dc.option(
					'path',
					function(pageIndex) {

						if (
							pageIndex >
							dcashopMaxPage
						) {

							return false;
						}

						if (
							typeof originalPath ===
							'function'
						) {

							return originalPath.call(
								this,
								pageIndex
							);

						}

						var url =
							new URL(
								window.location.href
							);

						url.searchParams.set(
							'paged',
							pageIndex
						);

						return url.toString();

					}
				);


				/* AJAX request */

				$products.on(
					'request.infiniteScroll',
					function() {

						if (
							dcashopInfiniteFinished
						) {
							return;
						}

						setTimeout(
							function() {

								if (
									!dcashopInfiniteFinished
								) {

									dcashopShowLoader();
									dcashopShowBottomSpinner();

								}

							},
							10
						);

					}
				);


				/* AJAX load */

				$products.on(
					'load.infiniteScroll',
					function() {

						if (
							dcashopInfiniteFinished
						) {
							return;
						}

						dcashopHideLoader();
						dcashopHideBottomSpinner();

					}
				);


				/* Products appended */

				$products.on(
					'append.infiniteScroll',
					function() {

						/* Fix product grid reflow */

						requestAnimationFrame(function () {

	                     $(window).trigger('resize');

	                    requestAnimationFrame(function () {

		                $(window).trigger('resize');

                    	});

                        });

						var instance =
							$products.data(
								'infiniteScroll'
							);

						if (!instance) {
							return;
						}


						/* Continue until page 5 */

						if (
							instance.pageIndex <
							dcashopMaxPage
						) {
							return;
						}


						/* Prevent duplicate execution */

						if (
							$products.data(
								'dcashop-stopped'
							)
						) {
							return;
						}


						$products.data(
							'dcashop-stopped',
							true
						);


						dcashopInfiniteFinished =
							true;


						sessionStorage.setItem(
							dcashopStorageKey,
							'1'
						);


						/* Stop infinite scroll */

						try {
							instance.destroy();
						} catch (e) {}


						dcashopHideLoader();
						dcashopHideBottomSpinner();


						/* Update URL */

						var url =
							new URL(
								window.location.href
							);

						url.searchParams.set(
							'paged',
							dcashopMaxPage
						);

						window.history.replaceState(
							{},
							'',
							url.pathname +
							'?' +
							url.searchParams.toString()
						);


						/* Load page 5 pagination */

						var paginationUrl =
							new URL(
								window.location.href
							);

						paginationUrl.searchParams.set(
							'paged',
							dcashopMaxPage
						);


						$.get(
							paginationUrl.toString(),
							function(response) {

								var $response =
									$('<div>').html(
										response
									);

								var $newPagination =
									$response
										.find(
											'.woocommerce-pagination'
										)
										.first();


								if (
									$newPagination.length
								) {

									$newPagination.attr(
										'style',
										'display: block !important;'
									);

									$('.woocommerce-pagination')
										.replaceWith(
											$newPagination
										);

								} else {

									$('.woocommerce-pagination')
										.attr(
											'style',
											'display: block !important;'
										);

								}

							}
						);

					}
				);

			},
			300
		);

});
