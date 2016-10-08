interface LyricsWikiResult {
	lyrics: Lyrics;
	media: Media[];
	producers: Artist[];
	vocalists: Artist[];	
	names: Names;
}

interface Lyrics {
	"ja-romanized"?: string;
	"ja"?: string;
}

interface Media {
	id: string;
	website: "yt" | "nn" | "pp";
}

interface Artist {
	vocadb?: string;
	roles: string[];
	name: string;
}

interface Names {
	romanized?: string;
	original: string;
	english?: string;
}