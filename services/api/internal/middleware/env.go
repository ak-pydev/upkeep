package middleware

import "os"

var envLookup = func(k string) string { return os.Getenv(k) }
