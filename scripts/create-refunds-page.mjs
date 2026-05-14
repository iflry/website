import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-03-20',
  useCdn: false,
})

const FORM_URL = 'https://forms.gle/K1YK8LKt7QjpDjs26'

const localized = {
  en: {
    title: 'Refunds',
    intro: 'If you need to request a refund (for example, for an event registration fee), please fill out the refund request form below.',
    linkText: 'Open the refund request form',
  },
  fr: {
    title: 'Remboursements',
    intro: "Si vous avez besoin de demander un remboursement (par exemple, pour des frais d'inscription à un événement), veuillez remplir le formulaire de demande de remboursement ci-dessous.",
    linkText: 'Ouvrir le formulaire de demande de remboursement',
  },
  es: {
    title: 'Reembolsos',
    intro: 'Si necesitas solicitar un reembolso (por ejemplo, por una tarifa de inscripción a un evento), por favor completa el formulario de solicitud de reembolso a continuación.',
    linkText: 'Abrir el formulario de solicitud de reembolso',
  },
}

function buildContent(intro, linkText) {
  const linkKey = 'reflnk'
  return [
    {
      _type: 'block',
      _key: 'b1',
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: 's1', text: intro, marks: []}],
    },
    {
      _type: 'block',
      _key: 'b2',
      style: 'normal',
      markDefs: [{_key: linkKey, _type: 'link', href: FORM_URL}],
      children: [{_type: 'span', _key: 's2', text: linkText, marks: [linkKey]}],
    },
  ]
}

async function run() {
  for (const [locale, copy] of Object.entries(localized)) {
    const id = `page.refunds.${locale}`
    const doc = {
      _id: id,
      _type: 'page',
      title: copy.title,
      language: locale,
      type: 'other',
      slug: {_type: 'slug', current: 'refunds'},
      content: buildContent(copy.intro, copy.linkText),
      createdAt: new Date().toISOString(),
    }
    await client.createOrReplace(doc)
    console.log(`Created/updated page: ${id}`)

    const configId = `configuration-${locale}`
    const config = await client.getDocument(configId)
    if (!config) {
      console.warn(`No ${configId} found — skipping footer update for ${locale}`)
      continue
    }
    const newLink = {
      _key: `refundLink_${locale}`,
      _type: 'footerLink',
      title: copy.title,
      linkType: 'page',
      page: {_type: 'reference', _ref: id},
    }
    const columns = config.footer?.columns || []
    if (columns.length === 0) {
      const colTitle = {en: 'Pages', fr: 'Pages', es: 'Páginas'}[locale]
      const newColumn = {
        _key: `refundCol_${locale}`,
        _type: 'footerColumn',
        title: colTitle,
        links: [newLink],
      }
      await client
        .patch(configId)
        .setIfMissing({footer: {}})
        .setIfMissing({'footer.columns': []})
        .insert('after', 'footer.columns[-1]', [newColumn])
        .commit()
      console.log(`Created footer column "${colTitle}" with refund link in ${configId}`)
      continue
    }
    let targetIdx = columns.findIndex((c) => /^(pages|páginas)$/i.test(c?.title || ''))
    if (targetIdx === -1) targetIdx = columns.findIndex((c) => Array.isArray(c?.links) && c.links.length > 0)
    if (targetIdx === -1) targetIdx = 0
    const targetCol = columns[targetIdx]
    const links = targetCol.links || []
    const alreadyLinked = links.some(
      (l) => l?.linkType === 'page' && l?.page?._ref === id,
    )
    if (alreadyLinked) {
      console.log(`Footer link already present in ${configId}`)
      continue
    }
    const colKey = targetCol._key
    await client
      .patch(configId)
      .setIfMissing({[`footer.columns[_key=="${colKey}"].links`]: []})
      .insert('after', `footer.columns[_key=="${colKey}"].links[-1]`, [newLink])
      .commit()
    console.log(`Added footer link in ${configId} (column "${targetCol.title}")`)
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
