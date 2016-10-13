
interface KnockoutBindingHandlers {
	artistAutoComplete: KnockoutBindingHandler;
}

ko.bindingHandlers.artistAutoComplete = {
	init: (element: HTMLElement, valueAccessor: Function) => {

		($(element) as any).typeahead({
			source: (query: string, callback: Function) => {

				$.ajax("https://vocadb.net/api/artists?nameMatchMode=Auto&query=" + query,
					{
						xhrFields: {
							withCredentials: false
						},
						dataType: 'json',
						success: (result) => {
							callback(result.items);
						}
					});

			},
			matcher: () => true,
			afterSelect: (item: vdb.Artist) => {
				valueAccessor()(item);
			}
		});

	}
}