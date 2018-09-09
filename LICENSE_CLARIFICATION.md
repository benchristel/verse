# License Clarification

Verse is licensed to you under the terms of the Gnu General
Public License (GPL), Version 3. See
[the LICENSE.md file](./LICENSE.md) in this repository for
more information.

Verse is an unusual piece of software, and even the GPL
could not have anticipated how weird it is. Some
clarification of the terms of the GPL is therefore in order.

## TL;DR

Code that you write using Verse is yours, and you can do
**whatever you want** with it. You are *always permitted*
to do the following things:

- Make apps using Verse and share them with other people
- Make apps using Verse and *sell* them to other people
- Write code using Verse and then use it for some other
  purpose that doesn't involve Verse.

The code **for Verse itself** is what is licensed under the
GPL. You are permitted to:

- Modify the Verse code in any way you like for personal
  use.
- Share or sell a modified version of Verse, as long as you
  make the source code for it available under a
  GPL-compatible license.
- Make apps using a modified version of Verse and share/sell
  them, as long as you make the source code for your
  modified version of Verse available under a GPL-compatible
  license.

If you make the change history of your version of Verse
publicly viewable (for instance, on GitHub or GitLab),
that shall be considered sufficient to comply with the
following language in the GPL:

> a) The work must carry prominent notices stating that you
> modified it, and giving a relevant date.

## Background

When you export a Verse application, Verse makes a copy
of its own code, pastes your application code inside,
and downloads the whole thing as an HTML file. This means
that if someone who is not familiar with how Verse works
receives a copy of a Verse app, they might not be able to
tell where Verse's code ends and your application code
begins. This is potentially problematic, because the GPL
places the following conditions on the redistribution of
licensed code:

1. **Provision of License and Source Code**. Anyone who comes
  into possession of GPL-licensed software must be able to
  get the source code too. They must also be able to get the
  license, so they know what their rights and
  responsibilities are.
2. **Attribution**. You must give credit to the original
  author of the code.
3. **Description of Changes**. If you have made changes to
  the code, they must be explicitly marked as such.
4. **Share-alike**. All code that you add to a GPL-licensed
  piece of software must *also* be freely shared under a
  "GPL-compatible" license. The effect of this is that GPL
  code, even if modified, cannot be turned into a
  proprietary, closed-source product.

Verse takes
care of the first two requirements for you by linking to the
Verse website.
The last two items are the potentially problematic ones.

The important thing to note is that a Verse HTML file
contains *two independently copyrighted works*:

- The code for Verse itself, which is copyright © Ben Christel
  and subject to the terms of the GPL.
- Your application code, for which you own the copyright.

The distinction between these two works is maintained by
means of an HTML tag that looks like this:

```
<script id="user-code" type="text/x-verse">
  ...
</script>
```

Everything within that HTML tag is *your* code.
