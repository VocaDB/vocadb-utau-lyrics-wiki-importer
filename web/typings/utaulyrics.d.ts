declare namespace utaulyrics {

	interface Song {
		lyrics: Lyrics[];
		media: Media[];
		producers: Artist[];
		vocalists: Artist[];
		names: Names;
		vocadb?: number;
	}

	interface Lyrics {
		lang: string;
		text: string;
		type: "original" | "romanized" | "translation";
	}

	type MediaService = "yt" | "nn" | "pp" | "sc";

	interface Media {
		id: string;
		website: MediaService;
	}

	type ArtistRole = "music" | "arrangement" | "lyrics" | "mastering" | "movie" | "illustration" | "vocalist";

	interface Artist {
		vocadb?: string;
		roles: ArtistRole[];
		name: string;
	}

	interface Names {
		romanized?: string;
		original: string;
		english?: string;
	}

}