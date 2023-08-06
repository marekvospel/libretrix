import { browser } from '$app/environment'
import { init, register } from 'svelte-i18n'

const defaultLocale = 'en-US'

register('en', () => import('../../locales/en-US.json'))
register('cs', () => import('../../locales/cs-CZ.json'))

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
})