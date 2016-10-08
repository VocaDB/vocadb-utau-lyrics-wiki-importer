
class ViewModel {

	public loadUrl = () => {

		// http://utaulyrics.wikia.com/wiki/A_Lonely_Amusement?action=raw
		var regex = /http:\/\/utaulyrics\.wikia\.com\/wiki\/(.+)/g;
		var match = regex.exec(this.url());

		if (match && match.length < 2)
			return;

		var pagename = match[1];

		$.get("http://vocaloid.eu/utaulyricswiki/api/lyrics-wiki?pagename=" + pagename, null, result => {

			if (!result)
				return;

			var parsed: LyricsWikiResult = JSON.parse(result);

			this.result(parsed);

		});

	}

	public result = ko.observable<LyricsWikiResult>(null);

	public url = ko.observable("");

}

ko.applyBindings(new ViewModel());