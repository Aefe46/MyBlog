'use server'
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function createPost(formData: FormData) {
  await prisma.post.create({
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      tags: formData.get('tags') as string,
    }
  });
  revalidatePath('/');
}

export async function createIdea(formData: FormData) {
  await prisma.idea.create({
    data: {
      content: formData.get('content') as string,
    }
  });
  revalidatePath('/fikirler');
}

export async function createListGroup(formData: FormData) {
  await prisma.listGroup.create({
    data: {
      icon: formData.get('icon') as string,
      title: formData.get('title') as string,
    }
  });
  revalidatePath('/listelerim');
  revalidatePath('/admin');
}

export async function createListItem(formData: FormData) {
  await prisma.listItem.create({
    data: {
      text: formData.get('text') as string,
      groupId: parseInt(formData.get('groupId') as string),
    }
  });
  revalidatePath('/listelerim');
}

export async function deletePost(id: number) {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteIdea(id: number) {
    await prisma.idea.delete({ where: { id } });
    revalidatePath('/fikirler');
    revalidatePath('/admin');
}

export async function deleteListGroup(id: number) {
    await prisma.listGroup.delete({ where: { id } });
    revalidatePath('/listelerim');
    revalidatePath('/admin');
}

export async function updateSiteName(formData: FormData) {
  const newName = formData.get('siteName') as string;
  await prisma.setting.upsert({
    where: { key: 'siteName' },
    update: { value: newName },
    create: { key: 'siteName', value: newName }
  });
  revalidatePath('/', 'layout');
}

export async function createNavLink(formData: FormData) {
  const title = formData.get('title') as string;
  const url = formData.get('url') as string;
  const order = parseInt(formData.get('order') as string) || 0;
  await prisma.navLink.create({ data: { title, url, order } });
  revalidatePath('/', 'layout');
}

export async function deleteNavLink(id: number) {
  await prisma.navLink.delete({ where: { id } });
  revalidatePath('/', 'layout');
}
