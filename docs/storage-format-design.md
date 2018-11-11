# The Verse Storage Format

This document describes the format Verse uses to export data to the user's filesystem.

## Goals

The goals of the format include:

- Reasonable git diffs. The idea of exporting is that the user can check in the exported file to source control.
- Reasonable size.
- Robustness against corruption by weird stuff in the data (i.e. no injection attacks)
- Ability to export source code, program data, or both
- Support for Unicode

## Format

All Verse data (code, program data) is exported in a single file. Both sections are optional, so you can export just the code, or just your savefile, or both together.

Export files are UTF-8 encoded, allowing expression of the full range of Unicode characters while minimizing the size of ASCII characters, which are assumed to be the majority. The variable character width of UTF-8 is not an issue; export files need not support random access.

### Version

The first line of the file consists of the file format version. The initial version will be:

```
Verse Export Format v1.0
```

The major version will be incremented for breaking changes; the minor version for backward-compatible changes.

### Divider

The file starts with a header that indicates a DIVIDER for the file's sections. This divider is chosen so it never appears in the exported data.

The default divider is:

```
_SECTION_
```

But if the text `\n_SECTION_\n` appears somewhere in the data, a number is appended, e.g.

```
_SECTION_0
```

The number chosen will be the lowest natural number such that the divider text does not occur in the data.

### Future: Metadata

> This section will not be included in v1.0. It might be useful in the future.

Following the first divider is a metadata section: a JSON document containing information about the file.

```
{
  "sha256": "b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c",
  "title": "Brief summary of changes in this file; optional. Analogous to the title of a git commit",
  "description": "Longer description of the changes; optional.",
  "parent": "7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
  "createdAtUtc": "2018-05-01 12:34:56 UTC",
  "createdAtLocal": "2018-05-01 05:34:56 PDT"
}
```

The `sha256` is a hash of the contents of this export. The `parent` field is the `sha256` of the export, if any, from which this export was derived.

### Files

Each file in the export is listed following the metadata section, preceded by a JSON object of file-level metadata. Files are separated from each other and from their metadata by `_SECTION_` dividers.

The files within an export are ordered by their (immutable, random) id. Because of this, renaming files or reordering them in the editor results in only a one-line diff.

### Example

```
Verse Export Format v1.0
_SECTION_
{
  "id": "bf07a7fb825f",
  "name": "hello.js",
  "type": "program",
  "index": 0
}
_SECTION_
define({
  displayText() {
    return 'Hello, world!'
  }
})
```
