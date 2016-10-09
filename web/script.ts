
class ViewModel {

	constructor() {

		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		});

		$.getJSON(this.vocaDbApiRoot + "/api/users/current", user => this.user(user)).fail(() => this.loggedIn(false));

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
			artist: (artist.vocadb ? { id: parseInt(artist.vocadb) } : null),
			isSupport: false,
			name: artist.name,
			roles: roles
		};

		return vdbArtist;

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

		// Append vocalist role to vocalists
		var vocalists: utaulyrics.Artist[] = _.map(this.result().vocalists, v => _.assign({ roles: ["vocalist"] }, v));

		// Get VocaDB artist links
		var artists: vdb.ArtistForSongContract[] = _
			.chain(this.result().producers)
			.concat(vocalists)
			.map(a => this.getArtistContract(a))
			.value();

		var createName = (value: string, language: vdb.Language) => {
			return { value: value, language: language } as vdb.LocalizedStringContract;
		};

		var names: vdb.LocalizedStringContract[] = _
			.chain([
				createName(this.result().names.original, "Japanese"),
				createName(this.result().names.romanized, "Romaji"),
				createName(this.result().names.english, "English")
			])
			.filter(n => n.value != null)
			.value();

		var pvUrl: string = this.result().media.length ? this.getPvUrl(this.result().media[0]) : null;

		var song: vdb.CreateSongContract = {
			artists: artists,
			names: names,
			pvUrl: pvUrl,
			songType: "Original",
			updateNotes: "Imported from UTAU Lyrics Wiki"
		};

		this.submitError(null);
		this.submitting(true);

		$.ajax(this.vocaDbApiRoot + "/api/songs", {
			data: JSON.stringify(song),
			method: "POST",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: result => {
				this.submittedSongId(result.id);
				this.result(null);
			}
		})
		.fail((xhr: JQueryXHR) => {
			this.submitError(xhr.responseText);
		})
		.always(() => this.submitting(false));

	}

	public submitError = ko.observable<string>(null);

	public submittedSongId = ko.observable<number>(null);

	public url = ko.observable("");

	public user = ko.observable(null);

	private vocaDbApiRoot = "https://vocadb.net/api"

}

$(() => {
	ko.applyBindings(new ViewModel());
});