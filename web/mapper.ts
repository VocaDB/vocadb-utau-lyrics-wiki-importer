namespace mapper {

	export class Mapper {

		public getPvUrl = (pv: utaulyrics.Media) => {

			switch (pv.website) {
				case "yt": return "https://youtu.be/" + pv.id;
				case "nn": return "http://nicovideo.jp/watch/" + pv.id;
				case "pp": return "http://piapro.jp/t/" + pv.id;
				default: return null;
			}

		}

		private mapArtist = (artist: utaulyrics.Artist) => {

			var roleMap: { [role: string]: vdb.ArtistRole; } = {
				"music": "Composer",
				"arrangement": "Arranger",
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

			var vdbArtist: vdb.ArtistForSong = {
				artist: (artist.vocadb ? { id: parseInt(artist.vocadb) } : null),
				isSupport: false,
				name: artist.name,
				roles: roles
			};

			return vdbArtist;

		}

		private mapLyrics = (lyrics: utaulyrics.Lyrics) => {

			var typeMap: { [lang: string]: vdb.TranslationType; } = {
				original: "Original",
				romanized: "Romanized",
				translation: "Translation"
			};

			var knownLanguages = ["en", "ja"];

			return {
				value: lyrics.text,
				translationType: typeMap[lyrics.type] || "Translation",
				cultureCode: _.includes(knownLanguages, lyrics.lang) ? lyrics.lang : null
			} as vdb.Lyrics;

		}

		public mapSong = (result: utaulyrics.Song, url: string) => {

			// Append vocalist role to vocalists
			var vocalists: utaulyrics.Artist[] = _.map(result.vocalists, v => _.assign({ roles: ["vocalist"] }, v));

			// Get VocaDB artist links
			var artists: vdb.ArtistForSong[] = _
				.chain(result.producers)
				.concat(vocalists)
				.map(a => this.mapArtist(a))
				.value();

			var createName = (value: string, language: vdb.Language) => {
				return { value: value, language: language } as vdb.LocalizedString;
			};

			var names: vdb.LocalizedString[] = _
				.chain([
					createName(result.names.original, "Japanese"),
					createName(result.names.romanized, "Romaji"),
					createName(result.names.english, "English")
				])
				.filter(n => n.value != null)
				.value();

			var pvUrl: string = result.media.length ? this.getPvUrl(result.media[0]) : null;

			var lyrics: vdb.Lyrics[] = _.map(result.lyrics, this.mapLyrics);

			var webLinks: vdb.WebLink[] = [
				{ url: url, description: "UTAU Lyrics Wiki", category: "Reference" }
			];

			var song: vdb.CreateSongContract = {
				artists: artists,
				lyrics: lyrics,
				names: names,
				pvUrl: pvUrl,
				songType: "Original",
				updateNotes: "Imported from UTAU Lyrics Wiki",
				webLinks: webLinks
			};

			return song;

		}

	}

}