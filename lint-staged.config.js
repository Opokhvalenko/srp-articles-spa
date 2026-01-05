export default {
	"**/*.{ts,tsx}": ["eslint --fix", "biome check --write"],
	"**/*.scss": ["stylelint --fix"],
};
