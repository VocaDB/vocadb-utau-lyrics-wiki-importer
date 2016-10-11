
declare namespace vdb {

	interface CreateSongContract {
		artists: ArtistForSongContract[];
		lyrics?: Lyrics[];
		names: LocalizedStringContract[];
		pvUrl?: string;
		songType: "Original" | "Cover" | "Remix";
		updateNotes?: string;
		webLinks?: WebLink[];
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

	interface Lyrics {
		cultureCode?: string;
		source?: string;
		translationType: TranslationType;
		url?: string;
		value: string;
	}

	type TranslationType = "Original" | "Romanized" | "Translation";

	interface WebLink {
		category: WebLinkCategory;
		description?: string;
		url: string;
	}

	type WebLinkCategory = "Official" | "Commercial" | "Reference" | "Other";

}