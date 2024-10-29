<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import {useUserStore} from "~/store/userStore";

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>
const userStore = useUserStore()

const state = reactive({
  email: undefined,
  password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await userStore.fetchCsrfToken()
  console.log(event.data)
  await userStore.login(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col mt-20 justify-center items-center space-y-4" @submit="onSubmit">
    <h1 class="text-4xl font-bold">Connexion</h1>
    <UFormGroup label="Nom" name="name">
      <UInput v-model="state.email" />
    </UFormGroup>


    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Mot de passe" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Se connecter
    </UButton>
    <div class="flex">
      <p>Vous n'ètes pas inscrit : <a href="/register" class="text-primary"> Inscrivez vous </a> </p>

    </div>
  </UForm>



</template>

