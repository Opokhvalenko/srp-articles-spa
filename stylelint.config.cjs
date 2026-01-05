module.exports = {
	extends: ["stylelint-config-standard-scss"],
	plugins: ["stylelint-scss"],
	rules: {
		"declaration-no-important": true,

		// kebab-case для класів
		"selector-class-pattern": [
			"^[a-z][a-z0-9-]*(?:__(?:[a-z0-9-]+))?(?:--(?:[a-z0-9-]+))?$",
			{
				message: "Use kebab-case + optional BEM: block__element--modifier",
			},
		],
	},
	ignoreFiles: ["dist/**/*"],
};
