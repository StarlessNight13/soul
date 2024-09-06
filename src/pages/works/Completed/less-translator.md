---
layout: "@layouts/BaseLayout.astro"
title: "Less Translator"
id: "less-translator"
state: "Complete"
description: "A Translator and a collection of Dictionaries."
techstack: ["Nextjs", "tailwindcss", "Typescript"]
link: "https://lesstr.vercel.app/"
---

# What is this?

The idea was to build a translator that could detect untranslated text and offer an option to look it up in a dictionary. Unfortunately, making text detection multilingual has proven to be difficult. If I have time, I plan to implement text detection for Latin characters only.

# What does it do?

For now, it's essentially a Google/Bing translator with three integrated dictionaries.

# How dose it work?

I used Next.js and React (with TypeScript) for the frontend, and Tailwind CSS for styling.

![it's not much, but it's honest work.](th-2278632.jpg)

<!-- The main challenge was dealing with the character limits imposed by Google and Bing Translate APIs. -->

<!-- end. for now! -->

# What is the next step?

- Creating a flashcard feature for the dictionaries, allowing users to add words and their translations to a deck.
  - To implement this, I'm considering using either local storage or a database.
