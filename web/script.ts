
class ViewModel {

	public loadUrl = () => {

		// http://utaulyrics.wikia.com/wiki/A_Lonely_Amusement?action=raw
		var regex = /http:\/\/utaulyrics\.wikia\.com\/wiki\/(.+)/g;
		var match = regex.exec(this.url());

		if (match && match.length < 2)
			return;

		var url = match[1];

		// http://utaulyrics.wikia.com/api.php?action=parse&disablepp=true&text=%7B%7B%23invoke%3Atest%20song%7Cshow%7C%E3%83%9B%E3%83%AF%E3%82%A4%E3%83%88%E3%83%8A%E3%82%A4%E3%83%88%20%28White%20Night%29%7D%7D&prop=text&format=json
		var text = encodeURIComponent('{{#invoke:test song|show|') + url + encodeURIComponent('}}');
		$.get("http://vocaloid.eu/utaulyricswiki/api/lyrics-wiki?pagename=" + url, null, result => {

			if (!result)
				return;

			var parsed = JSON.parse(result);

			this.originalTitle(parsed.names && parsed.names.original ? parsed.names.original : null);
			this.media(parsed.media);
			this.result(result);

		});

	}

	public media = ko.observableArray();

	public result = ko.observable("");

	public originalTitle = ko.observable("");

	public url = ko.observable("");


}

ko.applyBindings(new ViewModel());