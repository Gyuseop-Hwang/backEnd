import { franc } from 'franc'

import langs from 'langs';

import colors from 'colors';

const input = process.argv[2];

const langCode = franc(input)
// const langCode = franc('Alle menslike wesens word vry')

// Bonjour je suis colt

if (langCode === 'und') {
  console.log("Sorry, couldn't find".red)
} else {
  const language = langs.where("3", langCode)
  console.log(`our best guess is ${language.name}`.green)
}
