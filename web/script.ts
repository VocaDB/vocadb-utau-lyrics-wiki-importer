
class ViewModel {

	constructor() {

		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		});

		$.getJSON("https://vocadb.net/api/users/current", user => this.user(user)).fail(() => this.loggedIn(false));

	}

	public loadUrl = () => {

		// http://utaulyrics.wikia.com/wiki/A_Lonely_Amusement?action=raw
		var regex = /http:\/\/utaulyrics\.wikia\.com\/wiki\/(.+)/g;
		var match = regex.exec(this.url());

		if (!match || match.length < 2)
			return;

		var pagename = match[1];

		$.ajax("http://vocaloid.eu/utaulyricswiki/api/lyrics-wiki?pagename=" + pagename, {
			xhrFields: {
				withCredentials: false
			},
			success: (result: LyricsWikiResult) => {
				this.result(result);
			},
			dataType: 'json'
		});

	}

	public loggedIn = ko.observable(true);

	public result = ko.observable<LyricsWikiResult>(null);

	public url = ko.observable("");

	public user = ko.observable(null);

}

$(() => {
	ko.applyBindings(new ViewModel());
});