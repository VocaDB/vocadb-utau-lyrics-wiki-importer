
declare namespace vdb {

	interface CreateSongContract {
		artists: ArtistForSongContract[];
		names: LocalizedStringContract[];
		pvUrl?: string;
		songType: "Original" | "Cover" | "Remix";
		updateNotes?: string;
	}

	type ArtistRole = "Composer" | "Arranger" | "Lyricist" | "Mastering" | "Illustrator" | "Vocalist";

	type Language = "Unspecified" | "Japanese" | "Romaji" | "English";

	interface LocalizedStringContract {
		language: Language;
		value: string;
	}

	interface ArtistForSongContract {
		artist?: ArtistContract;
		isSupport?: boolean;
		name?: string;
		roles?: string;
	}

	interface ArtistContract {
		id?: number;
	}

}