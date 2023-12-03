<script lang="ts">
import { t } from 'svelte-i18n'
</script>

<svelte:head>
  <meta name="description" content="{ $t('seo.description') }"/>
  <meta name="og:description" content="{ $t('seo.description') }"/>
</svelte:head>

<div class="min-h-screen w-full h-full flex flex-col bg-base text-text">
  <slot />
</div>