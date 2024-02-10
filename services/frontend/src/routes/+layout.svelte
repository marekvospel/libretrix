<script lang='ts'>
  import { t } from 'svelte-i18n'
</script>

<svelte:head>
  <meta name='description' content={$t('seo.description')} />
  <meta name='og:description' content={$t('seo.description')} />
</svelte:head>

<div class='min-h-[100dvh] w-full h-full flex flex-col bg-primary-900 text-text'>
  <slot />
</div>
