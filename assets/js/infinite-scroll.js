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

	function dcashopShowLoader() {

	var $loader =
		$('.loader-image.infinite-scroll-request');

	if (!$loader.length) {
		return;
	}

	if (!$loader.find('.dcis-loader-box').length) {

		var $logo =
			$loader.find('.archive-img-loader').first();

		$logo.wrap('<div class="dcis-loader-box"></div>');

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

	function dcashopDisableInfiniteScroll() {

		var $products = $('.products');

		var dc = $products.data('infiniteScroll');

		if (dc) {

			try {
				dc.destroy();
			} catch (e) {}

		}

		dcashopHideLoader();

		$('.woocommerce-pagination')
			.attr(
				'style',
				'display: block !important;'
			);
	}

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

								}

							},
							10
						);

					}
				);

				$products.on(
					'load.infiniteScroll',
					function() {

						if (
							dcashopInfiniteFinished
						) {
							return;
						}

						dcashopHideLoader();

					}
				);

				$products.on(
					'append.infiniteScroll',
					function() {

						var instance =
							$products.data(
								'infiniteScroll'
							);

						if (!instance) {
							return;
						}

						if (
							instance.pageIndex <
							dcashopMaxPage
						) {
							return;
						}

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

						try {
							instance.destroy();
						} catch (e) {}

						dcashopHideLoader();

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