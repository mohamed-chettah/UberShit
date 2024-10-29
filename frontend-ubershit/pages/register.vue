<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import {useUserStore} from "~/store/userStore";

const schema = z.object({
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Enter a role')
})

type Schema = z.output<typeof schema>
const userStore = useUserStore()

const state = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
  passwordConfirmation: undefined,
  role: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (state.password !== state.passwordConfirmation) {
    alert('Les mots de passe ne correspondent pas.')
    return
  }
  let body = {
    name: state.name,
    email: state.email,
    password: state.password,
    password_confirmation: state.passwordConfirmation,
    role: state.role
  }
  await userStore.register(body)
}

const roles = [{
  name: 'Client',
  value: 'client'
}, {
  name: 'Chef',
  value: 'chef',
}, {
  name: 'Livreur',
  value: 'livreur'
}]

</script>
<template>
  <div class="flex flex-col items-center justify-center mt-10">
    <h1 class="text-4xl font-bold">Inscription</h1>

    <UForm :schema="schema" :state="state" class="flex flex-col mt-20 justify-center items-center space-y-4" @submit="onSubmit">
      <UFormGroup label="Nom" name="email">
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Mot de passe" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UFormGroup label="Mot de passe (Confirmation)" name="password">
        <UInput v-model="state.passwordConfirmation" type="password" />
      </UFormGroup>

      <USelect v-model="state.role" :options="roles" option-attribute="name" class="w-full"
               variant="outline"   placeholder="Votre rôle..."/>

      <UButton type="submit" :loading="userStore.loading">
        S'inscrire
      </UButton>
    </UForm>
  </div>
</template>

<style scoped>

</style>