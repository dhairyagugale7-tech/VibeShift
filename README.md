# VibeShift

### Same subject. Different world.

VibeShift transforms the environment around an uploaded subject into a
completely new visual vibe while keeping the subject itself intact.

Upload a photo, choose a vibe, and let VibeShift turn the world around
you into something completely different.

------------------------------------------------------------------------

## ✨ What is VibeShift?

Changing the *vibe* of a photo usually means manually editing
backgrounds, masking subjects, adjusting lighting, and spending time in
complex design tools.

VibeShift simplifies that process.

Instead of regenerating the entire image, VibeShift focuses on one core
idea:

> **Keep the subject. Transform the world around it.**

The subject's identity, pose, proportions, clothing, important details,
and position are preserved while the surrounding environment is
transformed according to the selected visual direction.

------------------------------------------------------------------------

## 🎯 The Problem

AI image generators are powerful, but completely regenerating an image
can unintentionally change the person or object you wanted to keep.

Traditional editing tools also require:

-   Manual background removal
-   Layer and mask editing
-   Lighting adjustments
-   Design experience
-   Multiple editing steps

VibeShift provides a simpler workflow focused specifically on
**environment transformation**.

------------------------------------------------------------------------

## 💡 The Solution

VibeShift separates the image conceptually into:

**Subject → stays**

**Environment → changes**

A user can:

1.  Upload an image
2.  Choose a visual vibe
3.  Customize the vibe
4.  Generate the transformation
5.  Compare the original and result
6.  Download the transformed image

------------------------------------------------------------------------

## 🔥 Features

### 🎨 AI Vibe Transformation

Transform the surrounding environment into different visual worlds while
preserving the original subject.

Available vibes include:

-   Coquette
-   Dark Luxury
-   Botanical
-   Dreamy
-   Y2K
-   Minimal

------------------------------------------------------------------------

### ✍️ Describe Your Vibe

Don't want to use a preset?

Describe the world you want in your own words.

Examples:

-   Dreamy Parisian rooftop at sunset
-   Dark gothic candlelit room
-   Futuristic chrome space
-   Pink luxury fashion editorial

VibeShift converts the description into a subject-preserving environment
transformation.

------------------------------------------------------------------------

### 🧩 Customize Your Vibe

Each preset vibe can be customized through:

-   Environment
-   Decor
-   Atmosphere
-   Lighting

This allows users to keep the same overall aesthetic while adjusting the
details of the generated environment.

------------------------------------------------------------------------

### 🔀 Blend Vibes

Combine two different vibes into one cohesive visual direction.

For example:

**Coquette + Dark Luxury**

or

**Botanical + Dreamy**

Users can control the blend ratio to create their own visual
combination.

------------------------------------------------------------------------

### 🌓 Before / After Comparison

The result page includes an interactive comparison slider.

Drag across the image to compare:

**Original → VibeShift**

This makes the transformation immediately visible.

------------------------------------------------------------------------

### 🕘 Creation History

VibeShift keeps recent creations available locally so users can revisit
previous transformations during their session.

------------------------------------------------------------------------

### 📐 Platform-ready Downloads

Export the result in common social and content formats:

-   9:16
-   4:5
-   1:1
-   16:9
-   3:4
-   Custom dimensions

The export workflow uses Cloudinary transformations to adapt the image
while preserving the visual subject.

------------------------------------------------------------------------

# ☁️ How Cloudinary Powers VibeShift

Cloudinary is a **core part of the VibeShift image pipeline**.

It is not being used only for static image storage.

Cloudinary participates throughout the image workflow --- from the
moment the user uploads an image to the moment the transformed result is
delivered and prepared for different output formats.

------------------------------------------------------------------------

## ☁️ 1. Cloudinary Upload

When the user uploads an image, VibeShift uses the **Cloudinary Upload
Widget**.

``` text
User
  ↓
Cloudinary Upload Widget
  ↓
Cloudinary
  ↓
Original Image Asset
```

The original image is uploaded to Cloudinary and becomes the source
asset for the transformation workflow.

This gives VibeShift a reliable media pipeline from the very beginning
of the experience.

The application does not need to build its own image-upload and
asset-storage infrastructure.

------------------------------------------------------------------------

## 🤖 2. Cloudinary Generative AI

The heart of VibeShift is Cloudinary's **generative background
replacement** capability.

The core transformation used by VibeShift is:

``` text
e_gen_background_replace
```

Instead of regenerating the entire photograph, VibeShift creates a
detailed natural-language prompt describing the environment that should
surround the existing subject.

For example:

``` text
Transform the environment into a dreamy high-fashion
pink luxury editorial setting while keeping the person
completely unchanged.

Preserve the exact face, identity, hairstyle,
body shape, proportions, pose, clothing,
shoes, phone and important details.

Only transform the surrounding environment.
```

That transformation is then passed into Cloudinary's generative image
pipeline.

Conceptually:

``` text
Original Image
      +
Vibe Prompt
      ↓
Cloudinary Generative AI
      ↓
New Environment
      ↓
Same Subject
```

This is what enables VibeShift's central promise:

> **Same subject. Different world.**

------------------------------------------------------------------------

## 🎨 3. VibeShift Adds the Creative Intelligence

Cloudinary provides the image transformation capability.

VibeShift builds the **creative experience and visual direction layer**
around it.

Each VibeShift aesthetic has its own visual direction covering elements
such as:

-   Environment
-   Decor
-   Atmosphere
-   Lighting
-   Materials
-   Color direction

These settings are combined into a detailed transformation prompt before
the Cloudinary transformation is created.

This means users do not need to understand:

-   AI prompting
-   Cloudinary transformation syntax
-   Background generation
-   Image-processing workflows

They simply choose a vibe.

VibeShift translates that creative intention into a Cloudinary-powered
image transformation.

------------------------------------------------------------------------

## 🔀 4. Cloudinary Enables Vibe Blending

VibeShift can combine two visual aesthetics into one cohesive
environment.

For example:

``` text
Coquette
    +
Dark Luxury
    ↓
Blended Visual Direction
    ↓
Cloudinary Generative Transformation
```

Another example:

``` text
Botanical
    +
Dreamy
    ↓
Soft Natural Dreamscape
```

The selected vibes, their visual characteristics, and the chosen blend
ratio are combined into a single transformation prompt.

The final environment is then generated through the same
Cloudinary-powered transformation pipeline.

This allows users to create visual combinations that are not limited to
the predefined presets.

------------------------------------------------------------------------

## 🎛️ 5. Cloudinary-Powered Vibe Customization

VibeShift allows users to customize the selected aesthetic through:

``` text
Environment
Decor
Atmosphere
Lighting
```

These controls modify the visual direction used to build the
transformation prompt.

For example:

``` text
Vibe
 ↓
Environment
 ↓
Decor
 ↓
Atmosphere
 ↓
Lighting
 ↓
Final Prompt
 ↓
Cloudinary Generative Transformation
```

This creates a layered creative workflow where Cloudinary handles the
actual image transformation while VibeShift controls the user's creative
intent.

------------------------------------------------------------------------

## 📐 6. Cloudinary-Powered Image Transformations

Cloudinary is also used when preparing generated images for different
output formats.

VibeShift supports:

-   9:16
-   4:5
-   1:1
-   16:9
-   3:4
-   Custom dimensions

The challenge with changing aspect ratios is that simply cropping an
image can make the subject appear too large or remove important parts of
the composition.

VibeShift instead uses Cloudinary transformations to preserve the
existing composition and extend the surrounding environment when
additional canvas space is required.

The export workflow uses transformations including:

``` text
c_pad
b_gen_fill
```

Conceptually:

``` text
Original Result
      ↓
Target Aspect Ratio
      ↓
Cloudinary Padding
      ↓
Generative Fill
      ↓
Extended Environment
      ↓
Final Export
```

This allows the surrounding world to expand rather than unnecessarily
zooming into or cropping the subject.

------------------------------------------------------------------------

## 🔗 7. Cloudinary Delivery

The generated result remains part of the Cloudinary image pipeline.

VibeShift can use the resulting Cloudinary image URL directly inside the
result experience.

``` text
Cloudinary
    ↓
Generated Image
    ↓
Cloudinary Delivery URL
    ↓
VibeShift Result Page
```

This avoids the need for a separate image-processing and delivery
infrastructure.

Cloudinary handles the media delivery layer while VibeShift focuses on
the creative experience.

------------------------------------------------------------------------

# 🔄 The Complete VibeShift × Cloudinary Pipeline

``` text
                 USER
                   │
                   ▼
        ┌─────────────────────┐
        │ Cloudinary Upload   │
        │       Widget        │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Cloudinary Original │
        │       Asset         │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ VibeShift Creative  │
        │   Prompt Engine     │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────────────┐
        │ Cloudinary Generative AI    │
        │                             │
        │ e_gen_background_replace    │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │ Same Subject               │
        │             +              │
        │ New Environment            │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │ Cloudinary Image Delivery   │
        │ & Transformations           │
        └─────────────┬───────────────┘
                      │
                      ▼
                 VIBESHIFT
```

------------------------------------------------------------------------

## 💎 Why Cloudinary is Important to VibeShift

Cloudinary enables VibeShift to combine:

``` text
Image Upload
      ↓
Generative AI
      ↓
Background Transformation
      ↓
Image Delivery
      ↓
Format Transformation
      ↓
Final Export
```

inside one image workflow.

Without this infrastructure, VibeShift would need separate systems for:

-   Image uploads
-   Asset management
-   Generative background transformation
-   Image processing
-   Aspect-ratio adaptation
-   Media delivery

Cloudinary brings these capabilities together.

That makes Cloudinary more than an infrastructure dependency in
VibeShift.

It is part of the **core product experience**.

------------------------------------------------------------------------

## 🛠 Tech Stack

### Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Framer Motion
-   Lucide React

### Image Infrastructure

-   Cloudinary
-   Cloudinary Upload Widget
-   Cloudinary Generative Transformations

### Deployment

-   Vercel

------------------------------------------------------------------------

## 🚀 Run Locally

### 1. Clone the repository

``` bash
git clone https://github.com/dhairyagugale7-tech/VibeShift.git
cd VibeShift
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

``` text
.env.local
```

Add:

``` env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

> Never commit `.env.local` or expose your Cloudinary API secret.

A safe template is provided in:

``` text
.env.example
```

### 4. Start the development server

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## 🔐 Environment Variables

  -------------------------------------------------------------------------
  Variable                              Purpose
  ------------------------------------- -----------------------------------
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`   Cloudinary cloud name used by the
                                        client

  `CLOUDINARY_URL`                      Cloudinary connection configuration
  -------------------------------------------------------------------------

The actual credentials must remain in `.env.local` or your deployment
platform's environment variable settings.

------------------------------------------------------------------------

## 📁 Project Structure

``` text
VibeShift/
│
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts
│   ├── result/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── BlendVibesModal.tsx
│   ├── VibeShiftHome.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── lib/
│   └── vibe-prompts.ts
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

------------------------------------------------------------------------

## 🖼️ Screenshots

### VibeShift Home

![VibeShift Home](./screenshots/home.png)

### AI Environment Transformation

![AI Environment Transformation](./screenshots/transformation.png)

### Before / After Comparison

![Before and After Comparison](./screenshots/comparison.png)

### Custom Vibe — Pink Luxury Editorial

![Pink Luxury Editorial](./screenshots/pink-luxury.png)

------------------------------------------------------------------------

## 🎥 Demo

**Live Demo:**\
Coming soon

**Demo Video:**\
Coming soon

The demo showcases:

-   Image upload
-   Preset vibe transformation
-   Vibe customization
-   Custom vibe generation
-   Vibe blending
-   Before / after comparison
-   Image downloads

------------------------------------------------------------------------

## 🏆 Hackathon

Built for the:

### HackIndia × Cloudinary AI Hackathon 2026

**Track:** Pixels to Products --- Cloudinary AI

VibeShift uses Cloudinary as an active part of the product's image
workflow, including:

-   Image upload
-   Cloudinary asset management
-   Generative background replacement
-   Image delivery
-   Image transformations
-   Generative fill for extended exports

------------------------------------------------------------------------

## 👥 Team

**VibeShift**

HackIndia × Cloudinary AI Hackathon 2026

------------------------------------------------------------------------

## 📌 Project Status

VibeShift is being developed as a hackathon project and is actively
being prepared for final submission.

------------------------------------------------------------------------

## 📄 License

This project is currently provided for hackathon/demo purposes.
