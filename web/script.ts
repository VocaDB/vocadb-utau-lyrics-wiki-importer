
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

	private getArtistContract = (artist: utaulyrics.Artist) => {

		var roleMap: { [role: string]: string; } = {
			"music": "Composer",
			"lyrics": "Lyricist",
			"mastering": "Mastering",
			"illustration": "Illustrator",
			"vocalist": "Vocalist"
		};

		var roles = _
			.chain(artist.roles)
			.map(r => roleMap[r])
			.filter(r => r != null)
			.join(",")
			.value();

		var vdbArtist: vdb.ArtistForSongContract = {
			artist: (artist.vocadb ? { id: artist.vocadb } : null),
			isSupport: false,
			name: artist.name,
			roles: roles
		};

	}

	public getPvUrl = (pv: utaulyrics.Media) => {

		switch (pv.website) {
			case "yt": return "https://youtu.be/" + pv.id;
			case "nn": return "http://nicovideo.jp/watch/" + pv.id;
			case "pp": return "http://piapro.jp/t/" + pv.id;
			default: return null;
		}

	}

	public loadUrl = () => {

		// http://utaulyrics.wikia.com/wiki/A_Lonely_Amusement
		var regex = /http:\/\/utaulyrics\.wikia\.com\/wiki\/(.+)/g;
		var match = regex.exec(this.url());

		if (!match || match.length < 2)
			return;

		var pagename = match[1];

		$.ajax("http://vocaloid.eu/utaulyricswiki/api/lyrics-wiki?pagename=" + pagename, {
			xhrFields: {
				withCredentials: false
			},
			success: (result: utaulyrics.LyricsWikiResult) => {
				this.result(result);
			},
			dataType: 'json'
		});

	}

	public loggedIn = ko.observable(true);

	public result = ko.observable<utaulyrics.LyricsWikiResult>(null);

	public submitting = ko.observable(false);

	public submit = () => {

		var artists = _
			.chain(this.result().producers)
			.concat(_.map(this.result().vocalists, v => {
				return { vocadb: v.vocadb, name: v.name, roles: 'vocalist' }
			}))
			.value();

		var names: vdb.LocalizedStringContract[] = _
			.chain([
				{ value: this.result().names.original, language: "Japanese" } as vdb.LocalizedStringContract,
				{ value: this.result().names.romanized, language: "Romaji" } as vdb.LocalizedStringContract,
				{ value: this.result().names.english, language: "English" } as vdb.LocalizedStringContract
			])
			.filter(n => n.value != null)
			.value();

		var pvUrl = this.result().media.length ? this.getPvUrl(this.result().media[0]) : null;

		var song: vdb.CreateSongContract = {
			artists: artists,
			names: names,
			pvUrl: pvUrl,
			songType: "Original",
			updateNotes: "Imported from UTAU Lyrics Wiki"
		};

		this.submitting(true);

		$.post("https://vocadb.net/api/songs", song).always(() => this.submitting(false));

	}

	public url = ko.observable("");

	public user = ko.observable(null);

}

$(() => {
	ko.applyBindings(new ViewModel());
});