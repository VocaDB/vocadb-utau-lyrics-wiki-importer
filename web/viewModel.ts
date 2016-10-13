namespace mapper {

	export class ViewModel {

		constructor() {

			$.ajaxSetup({
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				}
			});

			$.getJSON(this.vocaDbApiRoot + "/api/users/current", user => this.user(user)).fail(() => this.loggedIn(false));

		}

		public artists = ko.observableArray<ArtistViewModel>([]);

		public getPvUrl = (pv: utaulyrics.Media) => {
			return this.mapper.getPvUrl(pv);
		}

		public loadUrl = () => {

			this.submitError(null);
			this.submittedSongId(null);

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
				success: (result: utaulyrics.Song) => {
					if (result) {
						this.artists(_.map(this.mapper.mapArtists(result.producers, result.vocalists), a => new ArtistViewModel(a, this.vocaDbApiRoot)));
					}
					this.result(result);
				},
				dataType: 'json'
			});

		}

		public loggedIn = ko.observable(true);

		private mapper = new Mapper();

		public result = ko.observable<utaulyrics.Song>(null);

		public submitting = ko.observable(false);

		public submit = () => {

			var artists = _.map(this.artists(), a => a.toVocaDb());
			var song = this.mapper.mapSong(this.result(), artists, this.url());

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

		private vocaDbApiRoot = "https://vocadb.net";
		//private vocaDbApiRoot = "http://localhost:39390";

	}

	class ArtistViewModel {

		constructor(artist: vdb.ArtistForSong, root: string) {
			this.name = artist.name;
			this.roles = artist.roles;
			this.vocaDbId = ko.observable(artist.artist ? artist.artist.id : null);
			this.vocaDbName = ko.observable(artist.artist ? artist.name : null);
			this.editable = !this.vocaDbId();
			this.url = ko.computed(() => root + "/Ar/" + this.vocaDbId());
			this.artist = ko.computed({
				read: () => { return { id: this.vocaDbId(), name: this.vocaDbName() } },
				write: (artist) => {
					this.vocaDbId(artist ? artist.id : null);
					this.vocaDbName(artist ? artist.name : null);
				}
			});
		}

		public remove = () => {
			this.artist(null);
			this.autoCompleteName(null);
		}

		public toVocaDb = () => {
			return { artist: this.artist() && this.artist().id ? this.artist() : null, name: this.name, roles: this.roles, isSupport: false } as vdb.ArtistForSong;
		}

		public artist: KnockoutComputed<vdb.Artist>;
		public autoCompleteName = ko.observable(null);
		public editable: boolean;
		public name: string;
		public roles: string;
		public url: KnockoutComputed<string>;
		public vocaDbId: KnockoutObservable<number>;
		public vocaDbName: KnockoutObservable<string>;
	}

}
