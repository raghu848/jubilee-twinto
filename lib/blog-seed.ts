import type { Post } from "./types";

/*
  Three starter posts so the blog has shape before the client writes anything.
  Same rules as the rest of the site: the words are realistic stand-ins written
  in a developer's voice, and every image is an empty slot naming the shot it
  needs rather than stock photography.
*/

function b(id: string, kind: "heading" | "paragraph" | "quote" | "list", text: string) {
  return { id, kind, text } as const;
}

function img(id: string, alt: string) {
  return { id, kind: "image" as const, url: "", alt };
}

export const SEED_POSTS: Post[] = [
  {
    id: "post_vantage_slab",
    slug: "vantage-tower-a-reaches-the-twelfth-slab",
    title: "Vantage Tower A reaches the twelfth slab",
    excerpt:
      "Structure on the first of the three Kokapet towers is now twelve floors up, three weeks ahead of the internal programme.",
    category: "Construction update",
    author: "Site team, Jubilee Vantage",
    coverImage: "",
    coverAlt: "Tower A from the site entrance, twelfth slab poured",
    blocks: [
      b(
        "p1",
        "paragraph",
        "The twelfth slab on Tower A was poured on the morning of the 4th, which puts the structure three weeks ahead of the internal programme and comfortably inside the date written into the sale agreements. Pours are now running on a nine-day cycle rather than the eleven we budgeted for, largely because the second placing boom went up in February.",
      ),
      b("h1", "heading", "What is happening on site this month"),
      b(
        "l1",
        "list",
        "Tower A — slab thirteen, formwork struck to floor nine\nTower B — slab seven, blockwork started on the lower four floors\nTower C — raft complete, columns to podium level\nPodium — first level of parking decked, ramp shuttering underway",
      ),
      img("i1", "Placing boom over Tower A during the twelfth pour"),
      b(
        "p2",
        "paragraph",
        "The eastern landscape deck is being built alongside the towers rather than held back to the end of the programme. That is a slower and more expensive way to sequence a site — the deck has to be protected while cranes are still working over it — but it is the reason a family moving into Tower A next year will walk into a finished development rather than a completed flat on a building site.",
      ),
      b(
        "q1",
        "quote",
        "We would rather protect a finished deck for a year than hand over a home with hoarding outside the window.",
      ),
      b(
        "p3",
        "paragraph",
        "Buyers are welcome on site on Saturday mornings with a day's notice. Hard hats and boots are provided at the site office; children under twelve cannot go past the podium level.",
      ),
    ],
    projectSlug: "jubilee-vantage",
    status: "published",
    publishedAt: "2026-08-06T05:30:00.000Z",
    createdAt: "2026-08-06T05:30:00.000Z",
    updatedAt: "2026-08-06T05:30:00.000Z",
  },
  {
    id: "post_title_checks",
    slug: "what-your-advocate-should-ask-for-before-you-book",
    title: "What your advocate should ask for before you book",
    excerpt:
      "The six documents that settle whether a plot or apartment is safe to buy — and what it means when a developer is slow to hand them over.",
    category: "Buying guide",
    author: "Jubilee Sales",
    coverImage: "",
    coverAlt: "Title documents laid out on a desk at the sales office",
    blocks: [
      b(
        "p1",
        "paragraph",
        "Most disputes we see in the resale market were visible in the paperwork on day one. The buyer did not have the documents in front of their advocate before the booking amount went in, and by the time anyone looked properly the money was hard to get back.",
      ),
      b("h1", "heading", "The six documents"),
      b(
        "l1",
        "list",
        "Mother deed and the full title chain, usually thirty years\nEncumbrance certificate covering the same period\nApproved layout or building plan from the sanctioning authority\nRERA registration certificate for the project\nLatest property tax receipt and land conversion order\nNo-objection certificates from the relevant utilities",
      ),
      img("i1", "The approved layout drawing for a Jubilee Sales project"),
      b(
        "p2",
        "paragraph",
        "None of these are unusual to ask for, and none of them are difficult for a developer to produce if the land was bought outright and the approvals are genuine. The question worth paying attention to is not whether the developer has them — it is how quickly they arrive when you ask.",
      ),
      b(
        "q1",
        "quote",
        "If a booking amount has to be paid before the title chain is shared, that is the answer to your question.",
      ),
      b(
        "p3",
        "paragraph",
        "On our projects the full set goes to your advocate before you pay anything beyond the booking amount, and if your lawyer finds a problem the booking is refunded in full. That is written into the booking form rather than promised across a desk.",
      ),
    ],
    projectSlug: null,
    status: "published",
    publishedAt: "2026-07-18T05:30:00.000Z",
    createdAt: "2026-07-18T05:30:00.000Z",
    updatedAt: "2026-07-18T05:30:00.000Z",
  },
  {
    id: "post_anchorage_handover",
    slug: "anchorage-handed-over-four-months-early",
    title: "Anchorage handed over four months early",
    excerpt:
      "Ninety-six homes at Madhurawada were handed to owners in August, ahead of the date in the agreement. Here is what made the difference.",
    category: "Handover",
    author: "Jubilee Sales",
    coverImage: "",
    coverAlt: "Owners collecting keys at the Anchorage handover morning",
    blocks: [
      b(
        "p1",
        "paragraph",
        "Anchorage was committed for December 2025 and handed over in August. Four months is not a heroic margin, but early handovers are rare enough in this market that it is worth writing down how it happened rather than treating it as luck.",
      ),
      b("h1", "heading", "Three things that bought the time"),
      b(
        "l1",
        "list",
        "Facade materials were ordered against the structure programme, not the finishing programme, so nothing waited on a shipment\nThe salt-air specification was fixed before tendering, which removed a round of substitution requests\nSnagging ran floor by floor as the finishing trades left, instead of as one exercise at the end",
      ),
      img("i1", "Completed sea-facing elevation at Madhurawada"),
      b(
        "p2",
        "paragraph",
        "The third one matters most. Snagging a whole building at the end reliably adds six to ten weeks, because every defect found competes for the same handful of trades who have already moved to their next job. Running it floor by floor is administratively tedious and it is the single cheapest schedule saving available.",
      ),
      b(
        "p3",
        "paragraph",
        "Eight homes remain unsold and are available for immediate registration and possession. Ask the sales desk which ones.",
      ),
    ],
    projectSlug: "jubilee-anchorage",
    status: "published",
    publishedAt: "2026-06-02T05:30:00.000Z",
    createdAt: "2026-06-02T05:30:00.000Z",
    updatedAt: "2026-06-02T05:30:00.000Z",
  },
];
