import { collection, config, fields, singleton } from "@keystatic/core";

type PageKey = "about" | "products" | "solutions" | "finance" | "contact";
type Lang = "zh" | "en";

function translationMetaField() {
  return fields.object(
    {
      mode: fields.select({
        label: "Translation Mode",
        options: [
          { label: "Auto", value: "auto" },
          { label: "Manual Locked (No Auto Overwrite)", value: "manual_locked" },
        ],
        defaultValue: "auto",
      }),
      status: fields.select({
        label: "Translation Status",
        options: [
          { label: "Synced", value: "synced" },
          { label: "Outdated (ZH Updated)", value: "outdated" },
          { label: "Error", value: "error" },
        ],
        defaultValue: "synced",
      }),
      sourceHash: fields.text({
        label: "ZH Source Hash",
        defaultValue: "",
        description: "Auto-maintained for source drift detection.",
      }),
      lastTranslatedAt: fields.text({
        label: "Last Translated At",
        defaultValue: "",
      }),
    },
    { label: "Translation Metadata" },
  );
}

function focusPositionField(label: string) {
  return fields.select({
    label,
    options: [
      { label: "Center", value: "center center" },
      { label: "Top", value: "center top" },
      { label: "Bottom", value: "center bottom" },
      { label: "Left", value: "left center" },
      { label: "Right", value: "right center" },
      { label: "Top Left", value: "left top" },
      { label: "Top Right", value: "right top" },
      { label: "Bottom Left", value: "left bottom" },
      { label: "Bottom Right", value: "right bottom" },
    ],
    defaultValue: "center center",
  });
}

const navZh = collection({
  label: "ZH - Navigation (5 pages)",
  slugField: "key",
  path: "src/content/nav/zh/*",
  format: { data: "json" },
  schema: {
    key: fields.text({
      label: "Key (fixed semantic slot)",
      description:
        "Recommended: 01-about. Semantic slot should map to about/products/solutions/finance/contact.",
    }),
    title: fields.text({ label: "Title" }),
    href: fields.text({ label: "Href" }),
    order: fields.integer({ label: "Order", defaultValue: 1 }),
    published: fields.checkbox({ label: "Published", defaultValue: true }),
  },
});

const navEn = collection({
  label: "EN - Navigation (5 pages)",
  slugField: "key",
  path: "src/content/nav/en/*",
  format: { data: "json" },
  schema: {
    key: fields.text({
      label: "Key (fixed semantic slot)",
      description:
        "Recommended: 01-about. Semantic slot should map to about/products/solutions/finance/contact.",
    }),
    title: fields.text({ label: "Title" }),
    href: fields.text({ label: "Href" }),
    order: fields.integer({ label: "Order", defaultValue: 1 }),
    published: fields.checkbox({ label: "Published", defaultValue: true }),
    translation: translationMetaField(),
  },
});

const homeZh = singleton({
  label: "ZH - Home Main Config",
  path: "src/content/home/zh",
  format: { data: "json" },
  schema: {
    hero: fields.object(
      {
        titleLine1: fields.text({ label: "Hero Title Line 1" }),
        titleLine2: fields.text({ label: "Hero Title Line 2" }),
        subtitle: fields.text({ label: "Hero Subtitle", multiline: true }),
        buttonPrimaryText: fields.text({ label: "Primary Button Text" }),
        buttonPrimaryHref: fields.text({ label: "Primary Button Href", defaultValue: "/zh/products" }),
        buttonSecondaryText: fields.text({ label: "Secondary Button Text" }),
        buttonSecondaryHref: fields.text({ label: "Secondary Button Href", defaultValue: "/zh/contact" }),
        bgImage: fields.image({
          label: "Hero Background",
          directory: "public/uploads/home/zh",
          publicPath: "/uploads/home/zh/",
        }),
        bgImageFocus: focusPositionField("Hero Background Focus"),
      },
      { label: "Hero Section" },
    ),
    metrics: fields.array(
      fields.object(
        {
          value: fields.text({ label: "Value" }),
          unit: fields.text({ label: "Unit", defaultValue: "" }),
          desc: fields.text({ label: "Description" }),
        },
        { label: "Metric" },
      ),
      { label: "Core Metrics", itemLabel: (props) => props.fields.value.value || "Metric" },
    ),
    businessSection: fields.object(
      {
        show: fields.checkbox({ label: "Show Core Business", defaultValue: true }),
        title: fields.text({ label: "Section Title" }),
        desc: fields.text({ label: "Section Description", multiline: true }),
      },
      { label: "Core Business Section" },
    ),
    cardsSection: fields.object(
      {
        show: fields.checkbox({ label: "Show Cards Section", defaultValue: true }),
        cards: fields.array(
          fields.object(
            {
              title: fields.text({ label: "Card Title" }),
              summary: fields.text({ label: "Card Summary", multiline: true }),
              image: fields.image({
                label: "Card Image Upload",
                directory: "public/uploads/home/zh/cards",
                publicPath: "/uploads/home/zh/cards/",
              }),
              imageFocus: focusPositionField("Card Focus"),
              ctaText: fields.text({ label: "CTA Text", defaultValue: "了解更多" }),
              ctaHref: fields.text({ label: "CTA Href", defaultValue: "/zh/contact" }),
              order: fields.integer({ label: "Order", defaultValue: 1 }),
              published: fields.checkbox({ label: "Published", defaultValue: true }),
            },
            { label: "Card Item" },
          ),
          { label: "Page Cards", itemLabel: (props) => props.fields.title.value || "Card Item" },
        ),
      },
      { label: "Cards Section" },
    ),
    bottomListSection: fields.object(
      {
        show: fields.checkbox({ label: "Show Bottom List", defaultValue: true }),
        bottomList: fields.array(
          fields.object(
            {
              title: fields.text({ label: "Title" }),
              summary: fields.text({ label: "Summary", multiline: true }),
              order: fields.integer({ label: "Order", defaultValue: 1 }),
            },
            { label: "Bottom Item" },
          ),
          { label: "Bottom List Items", itemLabel: (props) => props.fields.title.value || "Bottom Item" },
        ),
      },
      { label: "Bottom List Section" },
    ),
    cta: fields.object(
      {
        title: fields.text({ label: "CTA Title" }),
        desc: fields.text({ label: "CTA Description", multiline: true }),
        buttonText: fields.text({ label: "CTA Button Text" }),
        buttonHref: fields.text({ label: "CTA Button Href", defaultValue: "/zh/contact" }),
      },
      { label: "CTA Section" },
    ),
  },
});

const homeEn = singleton({
  label: "EN - Home Main Config",
  path: "src/content/home/en",
  format: { data: "json" },
  schema: {
    hero: fields.object(
      {
        titleLine1: fields.text({ label: "Hero Title Line 1" }),
        titleLine2: fields.text({ label: "Hero Title Line 2" }),
        subtitle: fields.text({ label: "Hero Subtitle", multiline: true }),
        buttonPrimaryText: fields.text({ label: "Primary Button Text" }),
        buttonPrimaryHref: fields.text({ label: "Primary Button Href", defaultValue: "/en/products" }),
        buttonSecondaryText: fields.text({ label: "Secondary Button Text" }),
        buttonSecondaryHref: fields.text({ label: "Secondary Button Href", defaultValue: "/en/contact" }),
        bgImage: fields.image({
          label: "Hero Background",
          directory: "public/uploads/home/en",
          publicPath: "/uploads/home/en/",
        }),
        bgImageFocus: focusPositionField("Hero Background Focus"),
      },
      { label: "Hero Section" },
    ),
    metrics: fields.array(
      fields.object(
        {
          value: fields.text({ label: "Value" }),
          unit: fields.text({ label: "Unit", defaultValue: "" }),
          desc: fields.text({ label: "Description" }),
        },
        { label: "Metric" },
      ),
      { label: "Core Metrics", itemLabel: (props) => props.fields.value.value || "Metric" },
    ),
    businessSection: fields.object(
      {
        show: fields.checkbox({ label: "Show Core Business", defaultValue: true }),
        title: fields.text({ label: "Section Title" }),
        desc: fields.text({ label: "Section Description", multiline: true }),
      },
      { label: "Core Business Section" },
    ),
    cardsSection: fields.object(
      {
        show: fields.checkbox({ label: "Show Cards Section", defaultValue: true }),
        cards: fields.array(
          fields.object(
            {
              title: fields.text({ label: "Card Title" }),
              summary: fields.text({ label: "Card Summary", multiline: true }),
              image: fields.image({
                label: "Card Image Upload",
                directory: "public/uploads/home/en/cards",
                publicPath: "/uploads/home/en/cards/",
              }),
              imageFocus: focusPositionField("Card Focus"),
              ctaText: fields.text({ label: "CTA Text", defaultValue: "Read More" }),
              ctaHref: fields.text({ label: "CTA Href", defaultValue: "/en/contact" }),
              order: fields.integer({ label: "Order", defaultValue: 1 }),
              published: fields.checkbox({ label: "Published", defaultValue: true }),
            },
            { label: "Card Item" },
          ),
          { label: "Page Cards", itemLabel: (props) => props.fields.title.value || "Card Item" },
        ),
      },
      { label: "Cards Section" },
    ),
    bottomListSection: fields.object(
      {
        show: fields.checkbox({ label: "Show Bottom List", defaultValue: true }),
        bottomList: fields.array(
          fields.object(
            {
              title: fields.text({ label: "Title" }),
              summary: fields.text({ label: "Summary", multiline: true }),
              order: fields.integer({ label: "Order", defaultValue: 1 }),
            },
            { label: "Bottom Item" },
          ),
          { label: "Bottom List Items", itemLabel: (props) => props.fields.title.value || "Bottom Item" },
        ),
      },
      { label: "Bottom List Section" },
    ),
    cta: fields.object(
      {
        title: fields.text({ label: "CTA Title" }),
        desc: fields.text({ label: "CTA Description", multiline: true }),
        buttonText: fields.text({ label: "CTA Button Text" }),
        buttonHref: fields.text({ label: "CTA Button Href", defaultValue: "/en/contact" }),
      },
      { label: "CTA Section" },
    ),
    translation: translationMetaField(),
  },
});

function pageSchema(lang: Lang, page: PageKey) {
  const isZh = lang === "zh";
  const defaultHref = isZh ? "/zh/contact" : "/en/contact";
  const l = (zh: string, en: string) => (isZh ? zh : en);

  const schema: Record<string, any> = {
    heroSection: fields.object(
      {
        show: fields.checkbox({ label: l("显示首屏", "Show Hero"), defaultValue: true }),
        heroTitle: fields.text({ label: l("页面标题", "Page Title") }),
        heroSubtitle: fields.text({ label: l("页面副标题", "Page Subtitle"), multiline: true }),
        heroBgImage: fields.image({
          label: l("背景图片（可选）", "Background Image (Optional)"),
          directory: `public/uploads/pages/${lang}/${page}/hero`,
          publicPath: `/uploads/pages/${lang}/${page}/hero/`,
        }),
        heroBgFocus: focusPositionField("Background Focus"),
      },
      { label: l("首屏区域", "Hero Section") },
    ),
    mainSection: fields.object(
      {
        show: fields.checkbox({ label: l("显示主体区块", "Show Main Section"), defaultValue: true }),
        sectionTitle: fields.text({ label: l("区块标题", "Section Title") }),
        sectionBody: fields.text({ label: l("区块内容", "Section Body"), multiline: true }),
        sectionPrimaryButtonText: fields.text({ label: l("主按钮文案", "Primary Button Text"), defaultValue: "" }),
        sectionPrimaryButtonHref: fields.text({ label: l("主按钮链接", "Primary Button Href"), defaultValue: "" }),
        sectionSecondaryButtonText: fields.text({ label: l("次按钮文案", "Secondary Button Text"), defaultValue: "" }),
        sectionSecondaryButtonHref: fields.text({ label: l("次按钮链接", "Secondary Button Href"), defaultValue: "" }),
        legacyImage: fields.text({
          label: l("旧版图片路径（可选）", "Legacy Image Path (Optional)"),
          defaultValue: "",
        }),
        image: fields.image({
          label: l("主图上传", "Main Image Upload"),
          directory: `public/uploads/pages/${lang}/${page}`,
          publicPath: `/uploads/pages/${lang}/${page}/`,
        }),
        imageFocus: focusPositionField("Main Image Focus"),
      },
      { label: l("主体区域", "Main Section") },
    ),
    metricsSection: fields.object(
      {
        show: fields.checkbox({ label: l("显示指标", "Show Metrics"), defaultValue: false }),
        metrics: fields.array(
          fields.object(
            {
              value: fields.text({ label: l("数值", "Value") }),
              unit: fields.text({ label: l("单位", "Unit"), defaultValue: "" }),
              desc: fields.text({ label: l("描述", "Description") }),
            },
            { label: l("指标项", "Metric Item") },
          ),
          { label: l("指标列表", "Metrics"), itemLabel: (props) => props.fields.value.value || l("指标", "Metric") },
        ),
      },
      { label: l("指标区域", "Metrics Section") },
    ),
    middleSection: fields.object(
      {
        show: fields.checkbox({ label: l("显示中部标题区", "Show Middle Header"), defaultValue: true }),
        middleTitle: fields.text({ label: l("中部标题", "Middle Title"), defaultValue: "" }),
        middleSubtitle: fields.text({ label: l("中部副标题", "Middle Subtitle"), multiline: true, defaultValue: "" }),
      },
      { label: l("中部区域", "Middle Section") },
    ),
    cardsSection: fields.object(
      {
        show: fields.checkbox({ label: l("显示卡片区块", "Show Cards Section"), defaultValue: true }),
        cards: fields.array(
          fields.object(
            {
              title: fields.text({ label: l("卡片标题", "Card Title") }),
              summary: fields.text({ label: l("卡片摘要", "Card Summary"), multiline: true }),
              image: fields.image({
                label: l("卡片图片上传", "Card Image Upload"),
                directory: `public/uploads/pages/${lang}/${page}/cards`,
                publicPath: `/uploads/pages/${lang}/${page}/cards/`,
              }),
              imageFocus: focusPositionField("Card Focus"),
              ctaText: fields.text({ label: l("按钮文案", "CTA Text"), defaultValue: l("了解更多", "Read More") }),
              ctaHref: fields.text({ label: l("按钮链接", "CTA Href"), defaultValue: defaultHref }),
              order: fields.integer({ label: l("排序", "Order"), defaultValue: 1 }),
              published: fields.checkbox({ label: l("发布", "Published"), defaultValue: true }),
            },
            { label: l("卡片项", "Card Item") },
          ),
          { label: l("页面卡片", "Page Cards"), itemLabel: (props) => props.fields.title.value || l("卡片项", "Card Item") },
        ),
      },
      { label: l("卡片区域", "Cards Section") },
    ),
    bottomSection: fields.object(
      {
        show: fields.checkbox({ label: l("显示底部标题区", "Show Bottom Header"), defaultValue: true }),
        bottomTitle: fields.text({ label: l("底部标题", "Bottom Title"), defaultValue: "" }),
        bottomSubtitle: fields.text({ label: l("底部副标题", "Bottom Subtitle"), multiline: true, defaultValue: "" }),
      },
      { label: l("底部区域", "Bottom Section") },
    ),
    bottomListSection: fields.object(
      {
        show: fields.checkbox({ label: l("显示底部列表", "Show Bottom List"), defaultValue: true }),
        bottomList: fields.array(
          fields.object(
            {
              title: fields.text({ label: l("标题", "Title") }),
              summary: fields.text({ label: l("摘要", "Summary"), multiline: true }),
              order: fields.integer({ label: l("排序", "Order"), defaultValue: 1 }),
            },
            { label: l("底部项", "Bottom Item") },
          ),
          { label: l("底部列表项", "Bottom List Items"), itemLabel: (props) => props.fields.title.value || l("底部项", "Bottom Item") },
        ),
      },
      { label: l("底部列表区域", "Bottom List Section") },
    ),
    contactSection: fields.object(
      {
        show: fields.checkbox({ label: l("显示联系信息", "Show Contact Info"), defaultValue: false }),
        title: fields.text({ label: l("联系标题", "Contact Title"), defaultValue: "" }),
        addressLine1: fields.text({ label: l("地址第1行", "Address Line 1"), defaultValue: "" }),
        addressLine2: fields.text({ label: l("地址第2行", "Address Line 2"), defaultValue: "" }),
        email: fields.text({ label: l("邮箱", "Email"), defaultValue: "" }),
        phone: fields.text({ label: l("电话", "Phone"), defaultValue: "" }),
      },
      { label: l("联系区域", "Contact Section") },
    ),
  };

  if (!isZh) {
    schema.translation = translationMetaField();
  }

  return schema;
}

export default config({
  storage: { kind: "local" },
  collections: {
    navZh,
    navEn,
  },
  singletons: {
    homeZh,
    homeEn,
    aboutZh: singleton({ label: "ZH - 关于我们", path: "src/content/pages/zh/about", format: { data: "json" }, schema: pageSchema("zh", "about") }),
    productsPageZh: singleton({ label: "ZH - 产品与服务", path: "src/content/pages/zh/products", format: { data: "json" }, schema: pageSchema("zh", "products") }),
    financePageZh: singleton({ label: "ZH - 融资", path: "src/content/pages/zh/finance", format: { data: "json" }, schema: pageSchema("zh", "finance") }),
    solutionsZh: singleton({ label: "ZH - 解决方案", path: "src/content/pages/zh/solutions", format: { data: "json" }, schema: pageSchema("zh", "solutions") }),
    contactZh: singleton({ label: "ZH - 联系我们", path: "src/content/pages/zh/contact", format: { data: "json" }, schema: pageSchema("zh", "contact") }),
    aboutEn: singleton({ label: "EN - About", path: "src/content/pages/en/about", format: { data: "json" }, schema: pageSchema("en", "about") }),
    productsPageEn: singleton({ label: "EN - Products", path: "src/content/pages/en/products", format: { data: "json" }, schema: pageSchema("en", "products") }),
    financePageEn: singleton({ label: "EN - Finance", path: "src/content/pages/en/finance", format: { data: "json" }, schema: pageSchema("en", "finance") }),
    solutionsEn: singleton({ label: "EN - Solutions", path: "src/content/pages/en/solutions", format: { data: "json" }, schema: pageSchema("en", "solutions") }),
    contactEn: singleton({ label: "EN - Contact", path: "src/content/pages/en/contact", format: { data: "json" }, schema: pageSchema("en", "contact") }),
  },
});
