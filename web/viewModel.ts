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

		public getPvUrl = (pv: utaulyrics.Media) => {
			return this.mapper.getPvUrl(pv);
		}

		public loadUrl = () => {

			this.submitError(null);

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

			var song = this.mapper.mapSong(this.result(), this.url());

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

}
