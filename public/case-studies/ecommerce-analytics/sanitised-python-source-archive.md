# Sanitised Python source archive

These **17 Python files** were supplied by the project owner for an educational portfolio. This archive preserves their implementation structure, with private property IDs, employer-specific properties, brand expressions and local filesystem paths replaced by safe example values. There are **no OAuth credentials, API keys, tokens, actual customer records or exported performance data** in this archive. Do not use the archive as-is with production credentials.

**Execution limits:** Scripts were not re-run against external accounts. Some use a rolling 365-day period instead of twelve complete calendar months. The GSC 30-output schema includes note-only CSVs. The ten GA4 modules have repeated authentication logic because these are original standalone scripts, not a refactored package. The early GA4 experiment has been given a descriptive filename.

**Dependencies:** Google Analytics Data API, Google Auth / OAuth, Google Search Console discovery client. OAuth client secrets and token files are intentionally omitted. Replace example values before local use; never commit secrets.

## File index

1. `01_daily_acquisition.py`
2. `02_device_conversion.py`
3. `03_buyer_geography.py`
4. `04_landing_pages.py`
5. `05_purchase_funnel.py`
6. `06_product_ecommerce.py`
7. `07_campaign_attribution.py`
8. `08_new_vs_returning.py`
9. `09_promotions_and_coupons.py`
10. `10_event_and_tracking_audit.py`
11. `ga4_report.py`
12. `ga4_early_experiment.py`
13. `gsc_00_test_connection.py`
14. `gsc_01_export_12m.py`
15. `gsc_03_export_all_30_full.py`
16. `gsc_05_export_16_to_30.py`
17. `gsc_07_finish_19_21_24.py`

---

## 01_daily_acquisition.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_daily_acquisition(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="sessionSourceMedium"),
        Dimension(name="sessionCampaignName"),
    ]
    metrics = [
        Metric(name="sessions"),
        Metric(name="totalUsers"),
        Metric(name="transactions"),
        Metric(name="purchaseRevenue"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    headers: list[str] = []
    rows: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        if not headers:
            headers = [h.name for h in response.dimension_headers] + [
                h.name for h in response.metric_headers
            ]

        for row in response.rows:
            rows.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_01_daily_acquisition_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_daily_acquisition(property_id=property_id)
```

---

## 02_device_conversion.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_device_conversion(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="deviceCategory"),
        Dimension(name="sessionSourceMedium"),
    ]
    metrics = [
        Metric(name="sessions"),
        Metric(name="transactions"),
        Metric(name="purchaseRevenue"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    headers: list[str] = []
    rows: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        if not headers:
            headers = [h.name for h in response.dimension_headers] + [
                h.name for h in response.metric_headers
            ]

        for row in response.rows:
            rows.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_02_device_conversion_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_device_conversion(property_id=property_id)
```

---

## 03_buyer_geography.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_buyer_geography(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="country"),
        Dimension(name="region"),
        Dimension(name="city"),
    ]
    metrics = [
        Metric(name="sessions"),
        Metric(name="totalPurchasers"),
        Metric(name="purchaseRevenue"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    headers: list[str] = []
    rows: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        if not headers:
            headers = [h.name for h in response.dimension_headers] + [
                h.name for h in response.metric_headers
            ]

        for row in response.rows:
            rows.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_03_buyer_geography_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_buyer_geography(property_id=property_id)
```

---

## 04_landing_pages.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_landing_pages(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="landingPagePlusQueryString"),
        Dimension(name="sessionSourceMedium"),
    ]
    metrics = [
        Metric(name="sessions"),
        Metric(name="transactions"),
        Metric(name="purchaseRevenue"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    headers: list[str] = []
    rows: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        if not headers:
            headers = [h.name for h in response.dimension_headers] + [
                h.name for h in response.metric_headers
            ]

        for row in response.rows:
            rows.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_04_landing_pages_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_landing_pages(property_id=property_id)
```

---

## 05_purchase_funnel.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Filter,
    FilterExpression,
    Metric,
    RunReportRequest,
)
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"
FUNNEL_STEPS = ["view_item", "add_to_cart", "begin_checkout", "purchase"]


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_purchase_funnel(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="eventName"),
    ]
    metrics = [
        Metric(name="eventCount"),
        Metric(name="totalUsers"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]
    event_filter = FilterExpression(
        filter=Filter(
            field_name="eventName",
            in_list_filter=Filter.InListFilter(values=FUNNEL_STEPS),
        )
    )

    daily_funnel: dict[str, dict[str, int]] = {}
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            dimension_filter=event_filter,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        for row in response.rows:
            date_val = row.dimension_values[0].value
            event_val = row.dimension_values[1].value
            count_val = int(float(row.metric_values[0].value))

            if date_val not in daily_funnel:
                daily_funnel[date_val] = {step: 0 for step in FUNNEL_STEPS}
            if event_val in daily_funnel[date_val]:
                daily_funnel[date_val][event_val] += count_val

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    headers = ["date"] + FUNNEL_STEPS
    sorted_dates = sorted(daily_funnel.keys())
    rows = [
        [d] + [daily_funnel[d][step] for step in FUNNEL_STEPS]
        for d in sorted_dates
    ]

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_05_purchase_funnel_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_purchase_funnel(property_id=property_id)
```

---

## 06_product_ecommerce.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_product_ecommerce(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="itemId"),
        Dimension(name="itemName"),
    ]
    metrics = [
        Metric(name="itemsViewed"),
        Metric(name="itemsAddedToCart"),
        Metric(name="itemsPurchased"),
        Metric(name="itemRevenue"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    headers: list[str] = []
    rows: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        if not headers:
            headers = [h.name for h in response.dimension_headers] + [
                h.name for h in response.metric_headers
            ]

        for row in response.rows:
            rows.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_06_product_ecommerce_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_product_ecommerce(property_id=property_id)
```

---

## 07_campaign_attribution.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_campaign_attribution(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="sessionCampaignId"),
        Dimension(name="sessionCampaignName"),
        Dimension(name="sessionSourceMedium"),
    ]
    metrics = [
        Metric(name="sessions"),
        Metric(name="transactions"),
        Metric(name="purchaseRevenue"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    headers: list[str] = []
    rows: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        if not headers:
            headers = [h.name for h in response.dimension_headers] + [
                h.name for h in response.metric_headers
            ]

        for row in response.rows:
            rows.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_07_campaign_attribution_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_campaign_attribution(property_id=property_id)
```

---

## 08_new_vs_returning.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_new_vs_returning(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="newVsReturning"),
        Dimension(name="firstUserSourceMedium"),
    ]
    metrics = [
        Metric(name="transactions"),
        Metric(name="purchaseRevenue"),
        Metric(name="totalUsers"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    headers: list[str] = []
    rows: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        if not headers:
            headers = [h.name for h in response.dimension_headers] + [
                h.name for h in response.metric_headers
            ]

        for row in response.rows:
            rows.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_08_new_vs_returning_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_new_vs_returning(property_id=property_id)
```

---

## 09_promotions_and_coupons.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def fetch_subreport(
    client: BetaAnalyticsDataClient,
    property_id: str,
    dimensions: list[str],
    metrics: list[str],
    start_date: str,
    end_date: str,
) -> list[list[str]]:
    dim_objs = [Dimension(name=d) for d in dimensions]
    met_objs = [Metric(name=m) for m in metrics]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    results: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dim_objs,
            metrics=met_objs,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        for row in response.rows:
            results.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    return results


def run_promotions_and_coupons(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    promo_rows = fetch_subreport(
        client=client,
        property_id=property_id,
        dimensions=["date", "itemPromotionId", "itemPromotionName"],
        metrics=["itemsPurchased", "itemRevenue"],
        start_date=start_date,
        end_date=end_date,
    )

    coupon_rows = fetch_subreport(
        client=client,
        property_id=property_id,
        dimensions=["date", "orderCoupon"],
        metrics=["transactions", "purchaseRevenue"],
        start_date=start_date,
        end_date=end_date,
    )

    headers = [
        "record_type",
        "date",
        "itemPromotionId",
        "itemPromotionName",
        "orderCoupon",
        "itemsPurchased",
        "transactions",
        "revenue",
    ]

    output_rows: list[list[str]] = []
    for d, promo_id, promo_name, items_purchased, item_rev in promo_rows:
        output_rows.append(["promotion", d, promo_id, promo_name, "", items_purchased, "", item_rev])

    for d, coupon, txns, purchase_rev in coupon_rows:
        output_rows.append(["coupon", d, "", "", coupon, "", txns, purchase_rev])

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_09_promotions_and_coupons_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(output_rows)

    print(
        f"Saved {len(output_rows)} rows ({len(promo_rows)} promotion, {len(coupon_rows)} coupon) to {csv_filename}"
    )
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_promotions_and_coupons(property_id=property_id)
```

---

## 10_event_and_tracking_audit.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
PAGE_SIZE = 100000
DEFAULT_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_event_and_tracking_audit(
    property_id: str = DEFAULT_PROPERTY_ID,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> str:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    dimensions = [
        Dimension(name="date"),
        Dimension(name="eventName"),
        Dimension(name="transactionId"),
    ]
    metrics = [
        Metric(name="eventCount"),
        Metric(name="ecommercePurchases"),
    ]
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    headers: list[str] = []
    rows: list[list[str]] = []
    offset = 0

    while True:
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=dimensions,
            metrics=metrics,
            date_ranges=date_ranges,
            limit=PAGE_SIZE,
            offset=offset,
        )
        response = client.run_report(request)

        if not headers:
            headers = [h.name for h in response.dimension_headers] + [
                h.name for h in response.metric_headers
            ]

        for row in response.rows:
            rows.append(
                [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
            )

        offset += len(response.rows)
        if not response.rows or offset >= response.row_count:
            break

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_10_event_and_tracking_audit_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")
    return csv_filename


if __name__ == "__main__":
    property_id = input(f"Enter GA4 Property ID [{DEFAULT_PROPERTY_ID}]: ").strip() or DEFAULT_PROPERTY_ID
    run_event_and_tracking_audit(property_id=property_id)
```

---

## ga4_report.py

```python
import csv
import glob
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]


def get_credentials(token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No client_secret*.json file found in this folder.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_report(
    property_id: str,
    start_date: str = "365daysAgo",
    end_date: str = "yesterday",
) -> None:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[
            Dimension(name="yearMonth"),
            Dimension(name="sessionDefaultChannelGroup"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="transactions"),
            Metric(name="purchaseRevenue"),
        ],
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        limit=100000,
    )

    response = client.run_report(request)
    headers = [h.name for h in response.dimension_headers] + [h.name for h in response.metric_headers]
    rows = [
        [v.value for v in row.dimension_values] + [v.value for v in row.metric_values]
        for row in response.rows
    ]

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"ga4_{property_id}_12m_{timestamp}.csv"

    with open(csv_filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows to {csv_filename}")


if __name__ == "__main__":
    property_id = input("Enter GA4 Property ID [YOUR_GA4_PROPERTY_ID]: ").strip() or "YOUR_GA4_PROPERTY_ID"
    run_report(property_id=property_id)
```

---

## ga4_early_experiment.py

```python
import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]


def get_credentials(client_secrets_file: str = "client_secret.json", token_file: str = "token.json") -> Credentials:
    creds = None
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(client_secrets_file, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_file, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
    return creds


def run_report(property_id: str, start_date: str = "30daysAgo", end_date: str = "yesterday") -> None:
    client = BetaAnalyticsDataClient(credentials=get_credentials())

    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[Dimension(name="sessionDefaultChannelGroup")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="purchaseRevenue"),
        ],
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        limit=10000,
    )

    response = client.run_report(request)

    headers = [h.name for h in response.dimension_headers] + [h.name for h in response.metric_headers]
    print("\t".join(headers))

    for row in response.rows:
        dims = [v.value for v in row.dimension_values]
        mets = [v.value for v in row.metric_values]
        print("\t".join(dims + mets))


if __name__ == "__main__":
    property_id = input("Enter GA4 Property ID: ").strip()
    run_report(property_id=property_id)
```

---

## gsc_00_test_connection.py

```python
import glob
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
TOKEN_FILE = "gsc_token.json"


def get_gsc_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            secret_files = glob.glob("gsc_client_secret*.json") or glob.glob("client_secret*.json")
            if not secret_files:
                raise FileNotFoundError("No gsc_client_secret*.json or client_secret*.json found.")
            flow = InstalledAppFlow.from_client_secrets_file(secret_files[0], SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w", encoding="utf-8") as f:
            f.write(creds.to_json())
    return build("searchconsole", "v1", credentials=creds)


if __name__ == "__main__":
    service = get_gsc_service()
    sites = service.sites().list().execute().get("siteEntry", [])
    print(f"Found {len(sites)} Search Console properties:")
    for s in sites:
        print(f"  - {s['siteUrl']}  (permissionLevel: {s['permissionLevel']})")
```

---

## gsc_01_export_12m.py

```python
import csv
import datetime
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
TOKEN_FILE = "gsc_token.json"
SITE_URL = "sc-domain:example.com"
ROW_LIMIT = 25000


def get_gsc_service():
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
        else:
            raise RuntimeError("Invalid gsc_token.json; delete it and re-run gsc_00_test_connection.py.")
    return build("searchconsole", "v1", credentials=creds)


def query_all_rows(service, site_url, start_date, end_date, dimensions, data_state="final"):
    all_rows = []
    start_row = 0

    while True:
        body = {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": dimensions,
            "rowLimit": ROW_LIMIT,
            "startRow": start_row,
            "dataState": data_state,
        }
        resp = service.searchanalytics().query(siteUrl=site_url, body=body).execute()
        rows = resp.get("rows", [])
        if not rows:
            break
        all_rows.extend(rows)
        if len(rows) < ROW_LIMIT:
            break
        start_row += ROW_LIMIT

    return all_rows


def write_csv(filepath, headers, rows_data):
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows_data)


def main():
    service = get_gsc_service()

    # GSC final data typically lags by 2-3 days
    end_dt = datetime.date.today() - datetime.timedelta(days=3)
    start_dt = end_dt - datetime.timedelta(days=365)
    start_str = start_dt.strftime("%Y-%m-%d")
    end_str = end_dt.strftime("%Y-%m-%d")

    stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    out_dir = os.path.join(os.getcwd(), f"gsc_example_store_12m_{stamp}")
    os.makedirs(out_dir, exist_ok=True)

    print(f"Exporting GSC data for {SITE_URL} from {start_str} to {end_str}...")
    print(f"Output folder: {out_dir}\n")

    # 1. Daily Site Totals
    daily_rows = query_all_rows(service, SITE_URL, start_str, end_str, ["date"])
    write_csv(
        os.path.join(out_dir, "gsc_01_daily_site_totals.csv"),
        ["date", "clicks", "impressions", "ctr", "position"],
        [
            [
                r["keys"][0],
                r.get("clicks", 0),
                r.get("impressions", 0),
                round(r.get("ctr", 0.0), 6),
                round(r.get("position", 0.0), 2),
            ]
            for r in daily_rows
        ],
    )
    print(f"[OK] gsc_01_daily_site_totals.csv -> {len(daily_rows)} rows")

    # 2. Queries (12M)
    query_rows = query_all_rows(service, SITE_URL, start_str, end_str, ["query"])
    write_csv(
        os.path.join(out_dir, "gsc_02_queries.csv"),
        ["query", "clicks", "impressions", "ctr", "position"],
        [
            [
                r["keys"][0],
                r.get("clicks", 0),
                r.get("impressions", 0),
                round(r.get("ctr", 0.0), 6),
                round(r.get("position", 0.0), 2),
            ]
            for r in query_rows
        ],
    )
    print(f"[OK] gsc_02_queries.csv -> {len(query_rows)} rows")

    # 3. Pages (12M)
    page_rows = query_all_rows(service, SITE_URL, start_str, end_str, ["page"])
    write_csv(
        os.path.join(out_dir, "gsc_03_pages.csv"),
        ["page", "clicks", "impressions", "ctr", "position"],
        [
            [
                r["keys"][0],
                r.get("clicks", 0),
                r.get("impressions", 0),
                round(r.get("ctr", 0.0), 6),
                round(r.get("position", 0.0), 2),
            ]
            for r in page_rows
        ],
    )
    print(f"[OK] gsc_03_pages.csv -> {len(page_rows)} rows")

    # 4. Granular Query + Page + Device + Country + Date (chunked monthly to avoid heavy payload caps)
    granular_out = []
    cur = start_dt
    while cur <= end_dt:
        chunk_end = min(cur + datetime.timedelta(days=29), end_dt)
        c_start = cur.strftime("%Y-%m-%d")
        c_end = chunk_end.strftime("%Y-%m-%d")
        c_rows = query_all_rows(
            service, SITE_URL, c_start, c_end, ["date", "query", "page", "device", "country"]
        )
        for r in c_rows:
            k = r["keys"]
            granular_out.append([
                k[0], k[1], k[2], k[3], k[4],
                r.get("clicks", 0),
                r.get("impressions", 0),
                round(r.get("ctr", 0.0), 6),
                round(r.get("position", 0.0), 2),
            ])
        print(f"     Fetched granular chunk {c_start} to {c_end}: {len(c_rows)} rows")
        cur = chunk_end + datetime.timedelta(days=1)

    write_csv(
        os.path.join(out_dir, "gsc_04_daily_query_page_device_country.csv"),
        ["date", "query", "page", "device", "country", "clicks", "impressions", "ctr", "position"],
        granular_out,
    )
    print(f"[OK] gsc_04_daily_query_page_device_country.csv -> {len(granular_out)} rows")

    # 5. Search Appearance (12M)
    app_rows = query_all_rows(service, SITE_URL, start_str, end_str, ["searchAppearance"])
    write_csv(
        os.path.join(out_dir, "gsc_05_search_appearance.csv"),
        ["search_appearance", "clicks", "impressions", "ctr", "position"],
        [
            [
                r["keys"][0],
                r.get("clicks", 0),
                r.get("impressions", 0),
                round(r.get("ctr", 0.0), 6),
                round(r.get("position", 0.0), 2),
            ]
            for r in app_rows
        ],
    )
    print(f"[OK] gsc_05_search_appearance.csv -> {len(app_rows)} rows")

    # 6. Sitemaps
    sitemaps = service.sitemaps().list(siteUrl=SITE_URL).execute().get("sitemap", [])
    sitemap_rows = []
    for sm in sitemaps:
        contents = sm.get("contents", [])
        submitted = sum(int(c.get("submitted", 0)) for c in contents)
        indexed = sum(int(c.get("indexed", 0)) for c in contents)
        sitemap_rows.append([
            sm.get("path", ""),
            sm.get("lastSubmitted", ""),
            sm.get("lastDownloaded", ""),
            sm.get("isPending", False),
            sm.get("isSitemapsIndex", False),
            sm.get("warnings", 0),
            sm.get("errors", 0),
            submitted,
            indexed,
        ])
    write_csv(
        os.path.join(out_dir, "gsc_06_sitemaps.csv"),
        [
            "path", "last_submitted", "last_downloaded", "is_pending",
            "is_sitemaps_index", "warnings", "errors", "submitted_urls", "indexed_urls"
        ],
        sitemap_rows,
    )
    print(f"[OK] gsc_06_sitemaps.csv -> {len(sitemap_rows)} rows")
    print("\nDone! All GSC CSVs saved to:", out_dir)


if __name__ == "__main__":
    main()
```

---

## gsc_03_export_all_30_full.py

```python
import csv
import datetime
import os
import re
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
TOKEN_FILE = "gsc_token.json"
SITE_URL = "sc-domain:example.com"
ROW_LIMIT = 25000
MAX_URL_INSPECTIONS = 250

BRAND_PATTERN = re.compile(r"\b(example_brand|legacy_brand)\b", re.IGNORECASE)


def get_gsc_service():
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
        else:
            raise RuntimeError("Invalid gsc_token.json; delete it and re-run gsc_00_test_connection.py.")
    return build("searchconsole", "v1", credentials=creds)


def query_rows(service, site_url, start_date, end_date, dimensions, search_type="web", paginate=True):
    all_rows = []
    start_row = 0
    while True:
        body = {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": dimensions,
            "type": search_type,
            "rowLimit": ROW_LIMIT,
            "startRow": start_row,
            "dataState": "final",
        }
        resp = service.searchanalytics().query(siteUrl=site_url, body=body).execute()
        rows = resp.get("rows", [])
        if not rows:
            break
        all_rows.extend(rows)
        if not paginate or len(rows) < ROW_LIMIT:
            break
        start_row += ROW_LIMIT
    return all_rows


def write_csv(filepath, headers, rows_data):
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows_data)


def metric_cols(r):
    return [
        r.get("clicks", 0),
        r.get("impressions", 0),
        round(r.get("ctr", 0.0), 6),
        round(r.get("position", 0.0), 2),
    ]


def export_step(manifest, step_no, name, filename, headers, fn):
    try:
        rows = fn()
        write_csv(filename, headers, rows)
        print(f"[OK] #{step_no:02d} {name} -> {len(rows)} rows ({os.path.basename(filename)})")
        manifest.append([step_no, name, os.path.basename(filename), len(rows), "OK"])
    except Exception as exc:
        write_csv(filename, headers, [])
        msg = f"ERROR: {exc}"
        print(f"[WARN] #{step_no:02d} {name} -> {msg}")
        manifest.append([step_no, name, os.path.basename(filename), 0, msg])


def main():
    service = get_gsc_service()

    end_dt = datetime.date.today() - datetime.timedelta(days=3)
    start_dt = end_dt - datetime.timedelta(days=365)
    start_str = start_dt.strftime("%Y-%m-%d")
    end_str = end_dt.strftime("%Y-%m-%d")

    stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    out_dir = os.path.join(os.getcwd(), f"gsc_30_datasets_12m_{stamp}")
    os.makedirs(out_dir, exist_ok=True)
    p = lambda fname: os.path.join(out_dir, fname)

    print(f"Exporting all 30 GSC datasets for {SITE_URL} ({start_str} to {end_str})...")
    print(f"Folder: {out_dir}\n")

    manifest = [["No.", "Dataset", "File", "Rows", "Status"]]

    daily_page_cache = []
    daily_query_cache = []

    def get_daily_page():
        nonlocal daily_page_cache
        if not daily_page_cache:
            daily_page_cache = query_rows(service, SITE_URL, start_str, end_str, ["date", "page"], "web")
        return daily_page_cache

    def get_daily_query():
        nonlocal daily_query_cache
        if not daily_query_cache:
            daily_query_cache = query_rows(service, SITE_URL, start_str, end_str, ["date", "query"], "web")
        return daily_query_cache

    # 01. Overall Search Performance
    export_step(
        manifest, 1, "Overall Search Performance", p("01_overall_search_performance.csv"),
        ["date", "search_type", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], "web"] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date"], "web")
        ],
    )

    # 02. Search Queries / Keywords
    export_step(
        manifest, 2, "Search Queries / Keywords", p("02_search_queries_keywords.csv"),
        ["date", "query", "clicks", "impressions", "ctr", "position"],
        lambda: [[r["keys"][0], r["keys"][1]] + metric_cols(r) for r in get_daily_query()],
    )

    # 03. Landing Page Performance
    export_step(
        manifest, 3, "Landing Page Performance", p("03_landing_page_performance.csv"),
        ["date", "page_url", "clicks", "impressions", "ctr", "position"],
        lambda: [[r["keys"][0], r["keys"][1]] + metric_cols(r) for r in get_daily_page()],
    )

    # 04. Query and Landing Page Combinations (monthly chunks for volume safety)
    def fetch_query_page():
        out = []
        cur = start_dt
        while cur <= end_dt:
            c_end = min(cur + datetime.timedelta(days=29), end_dt)
            for r in query_rows(
                service, SITE_URL, cur.strftime("%Y-%m-%d"), c_end.strftime("%Y-%m-%d"),
                ["date", "query", "page"], "web"
            ):
                out.append([r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r))
            cur = c_end + datetime.timedelta(days=1)
        return out

    export_step(
        manifest, 4, "Query and Landing Page Combinations", p("04_query_and_landing_page.csv"),
        ["date", "query", "page_url", "clicks", "impressions", "ctr", "position"],
        fetch_query_page,
    )

    # 05. Country Performance
    export_step(
        manifest, 5, "Country Performance", p("05_country_performance.csv"),
        ["date", "country", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "country"], "web")
        ],
    )

    # 06. Device Performance
    export_step(
        manifest, 6, "Device Performance", p("06_device_performance.csv"),
        ["date", "device", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "device"], "web")
        ],
    )

    # 07. Country and Device Performance
    export_step(
        manifest, 7, "Country and Device Performance", p("07_country_and_device.csv"),
        ["date", "country", "device", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "country", "device"], "web")
        ],
    )

    # 08. Query by Country
    export_step(
        manifest, 8, "Query by Country", p("08_query_by_country.csv"),
        ["date", "query", "country", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "query", "country"], "web")
        ],
    )

    # 09. Query by Device
    export_step(
        manifest, 9, "Query by Device", p("09_query_by_device.csv"),
        ["date", "query", "device", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "query", "device"], "web")
        ],
    )

    # 10. Page by Device
    export_step(
        manifest, 10, "Page by Device", p("10_page_by_device.csv"),
        ["date", "page_url", "device", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "page", "device"], "web")
        ],
    )

    # 11. Page by Country
    export_step(
        manifest, 11, "Page by Country", p("11_page_by_country.csv"),
        ["date", "page_url", "country", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "page", "country"], "web")
        ],
    )

    # 12. Product Page SEO Performance (/products/)
    export_step(
        manifest, 12, "Product Page SEO Performance", p("12_product_page_seo.csv"),
        ["date", "product_url", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1]] + metric_cols(r)
            for r in get_daily_page() if "/products/" in r["keys"][1].lower()
        ],
    )

    # 13. Collection Page SEO Performance (/collections/)
    export_step(
        manifest, 13, "Collection Page SEO Performance", p("13_collection_page_seo.csv"),
        ["date", "collection_url", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1]] + metric_cols(r)
            for r in get_daily_page() if "/collections/" in r["keys"][1].lower()
        ],
    )

    # 14. Blog and Content SEO Performance (/blogs/ or /news/ or /articles/)
    export_step(
        manifest, 14, "Blog and Content SEO Performance", p("14_blog_content_seo.csv"),
        ["date", "article_url", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1]] + metric_cols(r)
            for r in get_daily_page()
            if any(seg in r["keys"][1].lower() for seg in ("/blogs/", "/blog/", "/news/", "/articles/"))
        ],
    )

    # 15. Branded vs Non-Branded Searches
    export_step(
        manifest, 15, "Branded vs Non-Branded Searches", p("15_branded_vs_nonbranded.csv"),
        ["date", "brand_segment", "query", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [
                r["keys"][0],
                "BRANDED" if BRAND_PATTERN.search(r["keys"][1]) else "NON_BRANDED",
                r["keys"][1],
            ] + metric_cols(r)
            for r in get_daily_query()
        ],
    )

    # 16. Search Appearance and Rich Results
    export_step(
        manifest, 16, "Search Appearance and Rich Results", p("16_search_appearance_rich_results.csv"),
        ["date", "search_appearance", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "searchAppearance"], "web")
        ],
    )

    # 17. Image Search Performance
    export_step(
        manifest, 17, "Image Search Performance", p("17_image_search_performance.csv"),
        ["date", "query", "page_url", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "query", "page"], "image")
        ],
    )

    # 18. Video Search Performance
    export_step(
        manifest, 18, "Video Search Performance", p("18_video_search_performance.csv"),
        ["date", "query", "page_url", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "query", "page"], "video")
        ],
    )

    # 19. Google Discover Performance
    export_step(
        manifest, 19, "Google Discover Performance", p("19_google_discover_performance.csv"),
        ["date", "page_url", "country", "device", "clicks", "impressions", "ctr"],
        lambda: [
            [
                r["keys"][0], r["keys"][1], r["keys"][2], r["keys"][3],
                r.get("clicks", 0), r.get("impressions", 0), round(r.get("ctr", 0.0), 6),
            ]
            for r in query_rows(
                service, SITE_URL, start_str, end_str, ["date", "page", "country", "device"], "discover"
            )
        ],
    )

    # 20. Google News Performance
    export_step(
        manifest, 20, "Google News Performance", p("20_google_news_performance.csv"),
        ["date", "page_url", "country", "device", "clicks", "impressions", "ctr"],
        lambda: [
            [
                r["keys"][0], r["keys"][1], r["keys"][2], r["keys"][3],
                r.get("clicks", 0), r.get("impressions", 0), round(r.get("ctr", 0.0), 6),
            ]
            for r in query_rows(
                service, SITE_URL, start_str, end_str, ["date", "page", "country", "device"], "googleNews"
            )
        ],
    )

    # 21 & 24. Indexing/Coverage + HTTPS Status via URL Inspection API
    inspected_cache = []

    def inspect_top_urls():
        nonlocal inspected_cache
        if inspected_cache:
            return inspected_cache
        page_totals = {}
        for r in get_daily_page():
            url = r["keys"][1]
            page_totals[url] = page_totals.get(url, 0) + r.get("impressions", 0)
        ranked_urls = [u for u, _ in sorted(page_totals.items(), key=lambda x: x[1], reverse=True)][:MAX_URL_INSPECTIONS]
        results = []
        for url in ranked_urls:
            resp = service.urlInspection().index().inspect(
                body={"inspectionUrl": url, "siteUrl": SITE_URL}
            ).execute()
            idx = resp.get("inspectionResult", {}).get("indexStatusResult", {})
            results.append({
                "url": url,
                "verdict": idx.get("verdict", ""),
                "coverage_state": idx.get("coverageState", ""),
                "indexing_state": idx.get("indexingState", ""),
                "robots_txt_state": idx.get("robotsTxtState", ""),
                "last_crawl_time": idx.get("lastCrawlTime", ""),
                "page_fetch_state": idx.get("pageFetchState", ""),
                "google_canonical": idx.get("googleCanonical", ""),
                "user_canonical": idx.get("userCanonical", ""),
                "is_https": url.lower().startswith("https://"),
            })
        inspected_cache = results
        return inspected_cache

    export_step(
        manifest, 21, "Indexing and Coverage", p("21_indexing_and_coverage.csv"),
        [
            "page_url", "verdict", "coverage_state", "indexing_state",
            "robots_txt_state", "last_crawl_time", "page_fetch_state",
            "google_canonical", "user_canonical"
        ],
        lambda: [
            [
                x["url"], x["verdict"], x["coverage_state"], x["indexing_state"],
                x["robots_txt_state"], x["last_crawl_time"], x["page_fetch_state"],
                x["google_canonical"], x["user_canonical"]
            ]
            for x in inspect_top_urls()
        ],
    )

    # 22. Sitemap Performance
    export_step(
        manifest, 22, "Sitemap Performance", p("22_sitemap_performance.csv"),
        [
            "sitemap_url", "last_submitted", "last_downloaded", "is_pending",
            "is_sitemaps_index", "warnings", "errors", "submitted_urls", "indexed_urls"
        ],
        lambda: [
            [
                sm.get("path", ""),
                sm.get("lastSubmitted", ""),
                sm.get("lastDownloaded", ""),
                sm.get("isPending", False),
                sm.get("isSitemapsIndex", False),
                sm.get("warnings", 0),
                sm.get("errors", 0),
                sum(int(c.get("submitted", 0)) for c in sm.get("contents", [])),
                sum(int(c.get("indexed", 0)) for c in sm.get("contents", [])),
            ]
            for sm in service.sitemaps().list(siteUrl=SITE_URL).execute().get("sitemap", [])
        ],
    )

    # 23. Core Web Vitals
    export_step(
        manifest, 23, "Core Web Vitals", p("23_core_web_vitals_api_note.csv"),
        ["note"],
        lambda: [["Core Web Vitals field reports are not in GSC searchanalytics API; export from GSC UI or PageSpeed/CrUX API."]],
    )

    # 24. HTTPS Status
    export_step(
        manifest, 24, "HTTPS Status", p("24_https_status.csv"),
        ["page_url", "is_https", "page_fetch_state", "verdict"],
        lambda: [[x["url"], x["is_https"], x["page_fetch_state"], x["verdict"]] for x in inspect_top_urls()],
    )

    # 25. Structured Data / Merchant Listings
    export_step(
        manifest, 25, "Structured Data / Merchant Listings", p("25_structured_data_merchant_listings.csv"),
        ["date", "search_appearance", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1]] + metric_cols(r)
            for r in query_rows(service, SITE_URL, start_str, end_str, ["date", "searchAppearance"], "web")
            if any(k in r["keys"][1].upper() for k in ("MERCHANT", "PRODUCT", "REVIEW", "SNIPPET"))
        ],
    )

    # 26. Manual Actions and Security Issues
    export_step(
        manifest, 26, "Manual Actions and Security Issues", p("26_manual_actions_security_ui_note.csv"),
        ["note"],
        lambda: [["Manual Actions and Security Issues are only exposed in the GSC web UI, not via Search Console REST API."]],
    )

    # 27. Links and Backlinks
    export_step(
        manifest, 27, "Links and Backlinks", p("27_links_backlinks_ui_note.csv"),
        ["note"],
        lambda: [["Top linked pages/sites and anchor details are exported from GSC UI or GSC Bulk Export, not this REST endpoint."]],
    )

    # 28. Crawl Statistics
    export_step(
        manifest, 28, "Crawl Statistics", p("28_crawl_statistics_ui_note.csv"),
        ["note"],
        lambda: [["Crawl requests, response times, and Googlebot host logs are exported from GSC Settings -> Crawl stats or Bulk Export."]],
    )

    # 29. Monthly Keyword Ranking Trends (with month-over-month position delta)
    def fetch_monthly_keywords():
        monthly = {}
        for r in get_daily_query():
            month = r["keys"][0][:7]
            q = r["keys"][1]
            key = (q, month)
            clicks = r.get("clicks", 0)
            impr = r.get("impressions", 0)
            pos = r.get("position", 0.0)
            if key not in monthly:
                monthly[key] = {"clicks": 0, "impr": 0, "pos_impr_sum": 0.0}
            monthly[key]["clicks"] += clicks
            monthly[key]["impr"] += impr
            monthly[key]["pos_impr_sum"] += pos * max(impr, 1)

        by_query = {}
        for (q, month), d in monthly.items():
            avg_pos = round(d["pos_impr_sum"] / max(d["impr"], 1), 2)
            ctr = round(d["clicks"] / d["impr"], 6) if d["impr"] > 0 else 0.0
            by_query.setdefault(q, []).append((month, d["clicks"], d["impr"], ctr, avg_pos))

        out = []
        for q, series in sorted(by_query.items()):
            series.sort(key=lambda item: item[0])
            prev_pos = None
            for month, clicks, impr, ctr, avg_pos in series:
                pos_delta = round(prev_pos - avg_pos, 2) if prev_pos is not None else ""
                out.append([month, q, clicks, impr, ctr, avg_pos, prev_pos if prev_pos is not None else "", pos_delta])
                prev_pos = avg_pos
        return out

    export_step(
        manifest, 29, "Monthly Keyword Ranking Trends", p("29_monthly_keyword_ranking_trends.csv"),
        ["month", "query", "clicks", "impressions", "ctr", "avg_weighted_position", "prev_month_position", "position_improvement"],
        fetch_monthly_keywords,
    )

    # 30. SEO Campaign and Website Change Calendar
    export_step(
        manifest, 30, "SEO Campaign and Website Change Calendar", p("30_seo_change_calendar_log.csv"),
        ["date", "site_url", "window_start", "window_end", "notes"],
        lambda: [[datetime.date.today().isoformat(), SITE_URL, start_str, end_str, "12M GSC extraction run; append manual SEO/release events here."]],
    )

    write_csv(p("00_GSC_30_DATASETS_MANIFEST.csv"), manifest[0], manifest[1:])
    print("\nCompleted all 30 GSC datasets. Check 00_GSC_30_DATASETS_MANIFEST.csv inside:", out_dir)


if __name__ == "__main__":
    main()
```

---

## gsc_05_export_16_to_30.py

```python
import csv
import datetime
import os
import socket
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

socket.setdefaulttimeout(60)

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
TOKEN_FILE = "gsc_token.json"
SITE_URL = "sc-domain:example.com"
OUT_DIR = os.path.join(os.getcwd(), "gsc_30_datasets_12m_example")
ROW_LIMIT = 25000
MAX_URL_INSPECTIONS = 250


def get_gsc_service():
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
        else:
            raise RuntimeError("Invalid gsc_token.json; delete it and re-run gsc_00_test_connection.py.")
    return build("searchconsole", "v1", credentials=creds)


def query_rows(service, site_url, start_date, end_date, dimensions, search_type="web", paginate=True):
    all_rows = []
    start_row = 0
    while True:
        body = {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": dimensions,
            "type": search_type,
            "rowLimit": ROW_LIMIT,
            "startRow": start_row,
            "dataState": "final",
        }
        resp = service.searchanalytics().query(siteUrl=site_url, body=body).execute()
        rows = resp.get("rows", [])
        if not rows:
            break
        all_rows.extend(rows)
        if not paginate or len(rows) < ROW_LIMIT:
            break
        start_row += ROW_LIMIT
    return all_rows


def query_chunked(service, site_url, start_dt, end_dt, dimensions, search_type):
    out = []
    cur = start_dt
    while cur <= end_dt:
        c_end = min(cur + datetime.timedelta(days=29), end_dt)
        c_start = cur.strftime("%Y-%m-%d")
        c_end_str = c_end.strftime("%Y-%m-%d")
        rows = query_rows(service, site_url, c_start, c_end_str, dimensions, search_type)
        out.extend(rows)
        print(f"     [{search_type}] {c_start}..{c_end_str}: {len(rows)} rows")
        cur = c_end + datetime.timedelta(days=1)
    return out


def write_csv(filepath, headers, rows_data):
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows_data)


def metric_cols(r):
    return [
        r.get("clicks", 0),
        r.get("impressions", 0),
        round(r.get("ctr", 0.0), 6),
        round(r.get("position", 0.0), 2),
    ]


def export_step(manifest, step_no, name, filename, headers, fn):
    try:
        rows = fn()
        write_csv(filename, headers, rows)
        print(f"[OK] #{step_no:02d} {name} -> {len(rows)} rows ({os.path.basename(filename)})")
        manifest.append([step_no, name, os.path.basename(filename), len(rows), "OK"])
    except Exception as exc:
        write_csv(filename, headers, [])
        msg = f"ERROR: {exc}"
        print(f"[WARN] #{step_no:02d} {name} -> {msg}")
        manifest.append([step_no, name, os.path.basename(filename), 0, msg])


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    p = lambda fname: os.path.join(OUT_DIR, fname)

    service = get_gsc_service()
    end_dt = datetime.date.today() - datetime.timedelta(days=3)
    start_dt = end_dt - datetime.timedelta(days=365)
    start_str = start_dt.strftime("%Y-%m-%d")
    end_str = end_dt.strftime("%Y-%m-%d")

    print(f"Resuming GSC #16-#30 in: {OUT_DIR} ({start_str} to {end_str})\n")
    manifest = [["No.", "Dataset", "File", "Rows", "Status"]]

    app_cache = []

    def get_appearance():
        nonlocal app_cache
        if not app_cache:
            app_cache = query_rows(service, SITE_URL, start_str, end_str, ["searchAppearance"], "web")
        return app_cache

    # 16. Search Appearance and Rich Results (searchAppearance must be queried alone)
    export_step(
        manifest, 16, "Search Appearance and Rich Results", p("16_search_appearance_rich_results.csv"),
        ["window_start", "window_end", "search_appearance", "clicks", "impressions", "ctr", "position"],
        lambda: [[start_str, end_str, r["keys"][0]] + metric_cols(r) for r in get_appearance()],
    )

    # 17. Image Search Performance (30-day chunks)
    export_step(
        manifest, 17, "Image Search Performance", p("17_image_search_performance.csv"),
        ["date", "query", "page_url", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_chunked(service, SITE_URL, start_dt, end_dt, ["date", "query", "page"], "image")
        ],
    )

    # 18. Video Search Performance (30-day chunks)
    export_step(
        manifest, 18, "Video Search Performance", p("18_video_search_performance.csv"),
        ["date", "query", "page_url", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [r["keys"][0], r["keys"][1], r["keys"][2]] + metric_cols(r)
            for r in query_chunked(service, SITE_URL, start_dt, end_dt, ["date", "query", "page"], "video")
        ],
    )

    # 19. Google Discover Performance
    export_step(
        manifest, 19, "Google Discover Performance", p("19_google_discover_performance.csv"),
        ["date", "page_url", "country", "device", "clicks", "impressions", "ctr"],
        lambda: [
            [
                r["keys"][0], r["keys"][1], r["keys"][2], r["keys"][3],
                r.get("clicks", 0), r.get("impressions", 0), round(r.get("ctr", 0.0), 6),
            ]
            for r in query_chunked(service, SITE_URL, start_dt, end_dt, ["date", "page", "country", "device"], "discover")
        ],
    )

    # 20. Google News Performance
    export_step(
        manifest, 20, "Google News Performance", p("20_google_news_performance.csv"),
        ["date", "page_url", "country", "device", "clicks", "impressions", "ctr"],
        lambda: [
            [
                r["keys"][0], r["keys"][1], r["keys"][2], r["keys"][3],
                r.get("clicks", 0), r.get("impressions", 0), round(r.get("ctr", 0.0), 6),
            ]
            for r in query_chunked(service, SITE_URL, start_dt, end_dt, ["date", "page", "country", "device"], "googleNews")
        ],
    )

    # 21 & 24. Indexing/Coverage + HTTPS Status via URL Inspection API
    inspected_cache = []

    def inspect_top_urls():
        nonlocal inspected_cache
        if inspected_cache:
            return inspected_cache
        pages_file = p("03_landing_page_performance.csv")
        page_totals = {}
        if os.path.exists(pages_file):
            with open(pages_file, "r", encoding="utf-8-sig") as f:
                for row in csv.DictReader(f):
                    u = row.get("page_url", "")
                    impr = int(float(row.get("impressions") or 0))
                    page_totals[u] = page_totals.get(u, 0) + impr
        if not page_totals:
            for r in query_rows(service, SITE_URL, start_str, end_str, ["page"], "web"):
                page_totals[r["keys"][0]] = r.get("impressions", 0)

        ranked_urls = [u for u, _ in sorted(page_totals.items(), key=lambda x: x[1], reverse=True)][:MAX_URL_INSPECTIONS]
        results = []
        for idx_num, url in enumerate(ranked_urls, 1):
            resp = service.urlInspection().index().inspect(
                body={"inspectionUrl": url, "siteUrl": SITE_URL}
            ).execute()
            idx = resp.get("inspectionResult", {}).get("indexStatusResult", {})
            results.append({
                "url": url,
                "verdict": idx.get("verdict", ""),
                "coverage_state": idx.get("coverageState", ""),
                "indexing_state": idx.get("indexingState", ""),
                "robots_txt_state": idx.get("robotsTxtState", ""),
                "last_crawl_time": idx.get("lastCrawlTime", ""),
                "page_fetch_state": idx.get("pageFetchState", ""),
                "google_canonical": idx.get("googleCanonical", ""),
                "user_canonical": idx.get("userCanonical", ""),
                "is_https": url.lower().startswith("https://"),
            })
            if idx_num % 50 == 0:
                print(f"     Inspected {idx_num}/{len(ranked_urls)} URLs...")
        inspected_cache = results
        return inspected_cache

    export_step(
        manifest, 21, "Indexing and Coverage", p("21_indexing_and_coverage.csv"),
        [
            "page_url", "verdict", "coverage_state", "indexing_state",
            "robots_txt_state", "last_crawl_time", "page_fetch_state",
            "google_canonical", "user_canonical"
        ],
        lambda: [
            [
                x["url"], x["verdict"], x["coverage_state"], x["indexing_state"],
                x["robots_txt_state"], x["last_crawl_time"], x["page_fetch_state"],
                x["google_canonical"], x["user_canonical"]
            ]
            for x in inspect_top_urls()
        ],
    )

    # 22. Sitemap Performance
    export_step(
        manifest, 22, "Sitemap Performance", p("22_sitemap_performance.csv"),
        [
            "sitemap_url", "last_submitted", "last_downloaded", "is_pending",
            "is_sitemaps_index", "warnings", "errors", "submitted_urls", "indexed_urls"
        ],
        lambda: [
            [
                sm.get("path", ""),
                sm.get("lastSubmitted", ""),
                sm.get("lastDownloaded", ""),
                sm.get("isPending", False),
                sm.get("isSitemapsIndex", False),
                sm.get("warnings", 0),
                sm.get("errors", 0),
                sum(int(c.get("submitted", 0)) for c in sm.get("contents", [])),
                sum(int(c.get("indexed", 0)) for c in sm.get("contents", [])),
            ]
            for sm in service.sitemaps().list(siteUrl=SITE_URL).execute().get("sitemap", [])
        ],
    )

    # 23. Core Web Vitals
    export_step(
        manifest, 23, "Core Web Vitals", p("23_core_web_vitals_api_note.csv"),
        ["note"],
        lambda: [["Core Web Vitals field reports are not in GSC searchanalytics API; export from GSC UI or PageSpeed/CrUX API."]],
    )

    # 24. HTTPS Status
    export_step(
        manifest, 24, "HTTPS Status", p("24_https_status.csv"),
        ["page_url", "is_https", "page_fetch_state", "verdict"],
        lambda: [[x["url"], x["is_https"], x["page_fetch_state"], x["verdict"]] for x in inspect_top_urls()],
    )

    # 25. Structured Data / Merchant Listings
    export_step(
        manifest, 25, "Structured Data / Merchant Listings", p("25_structured_data_merchant_listings.csv"),
        ["window_start", "window_end", "search_appearance", "clicks", "impressions", "ctr", "position"],
        lambda: [
            [start_str, end_str, r["keys"][0]] + metric_cols(r)
            for r in get_appearance()
            if any(k in r["keys"][0].upper() for k in ("MERCHANT", "PRODUCT", "REVIEW", "SNIPPET"))
        ],
    )

    # 26. Manual Actions and Security Issues
    export_step(
        manifest, 26, "Manual Actions and Security Issues", p("26_manual_actions_security_ui_note.csv"),
        ["note"],
        lambda: [["Manual Actions and Security Issues are only exposed in the GSC web UI, not via Search Console REST API."]],
    )

    # 27. Links and Backlinks
    export_step(
        manifest, 27, "Links and Backlinks", p("27_links_backlinks_ui_note.csv"),
        ["note"],
        lambda: [["Top linked pages/sites and anchor details are exported from GSC UI or GSC Bulk Export, not this REST endpoint."]],
    )

    # 28. Crawl Statistics
    export_step(
        manifest, 28, "Crawl Statistics", p("28_crawl_statistics_ui_note.csv"),
        ["note"],
        lambda: [["Crawl requests, response times, and Googlebot host logs are exported from GSC Settings -> Crawl stats or Bulk Export."]],
    )

    # 29. Monthly Keyword Ranking Trends (built directly from already-exported 02_search_queries_keywords.csv)
    def fetch_monthly_keywords():
        q_file = p("02_search_queries_keywords.csv")
        monthly = {}
        with open(q_file, "r", encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                month = (row.get("date") or "")[:7]
                q = row.get("query", "")
                if not month or not q:
                    continue
                clicks = int(float(row.get("clicks") or 0))
                impr = int(float(row.get("impressions") or 0))
                pos = float(row.get("position") or 0.0)
                key = (q, month)
                if key not in monthly:
                    monthly[key] = {"clicks": 0, "impr": 0, "pos_impr_sum": 0.0}
                monthly[key]["clicks"] += clicks
                monthly[key]["impr"] += impr
                monthly[key]["pos_impr_sum"] += pos * max(impr, 1)

        by_query = {}
        for (q, month), d in monthly.items():
            avg_pos = round(d["pos_impr_sum"] / max(d["impr"], 1), 2)
            ctr = round(d["clicks"] / d["impr"], 6) if d["impr"] > 0 else 0.0
            by_query.setdefault(q, []).append((month, d["clicks"], d["impr"], ctr, avg_pos))

        out = []
        for q, series in sorted(by_query.items()):
            series.sort(key=lambda item: item[0])
            prev_pos = None
            for month, clicks, impr, ctr, avg_pos in series:
                pos_delta = round(prev_pos - avg_pos, 2) if prev_pos is not None else ""
                out.append([month, q, clicks, impr, ctr, avg_pos, prev_pos if prev_pos is not None else "", pos_delta])
                prev_pos = avg_pos
        return out

    export_step(
        manifest, 29, "Monthly Keyword Ranking Trends", p("29_monthly_keyword_ranking_trends.csv"),
        ["month", "query", "clicks", "impressions", "ctr", "avg_weighted_position", "prev_month_position", "position_improvement"],
        fetch_monthly_keywords,
    )

    # 30. SEO Campaign and Website Change Calendar
    export_step(
        manifest, 30, "SEO Campaign and Website Change Calendar", p("30_seo_change_calendar_log.csv"),
        ["date", "site_url", "window_start", "window_end", "notes"],
        lambda: [[datetime.date.today().isoformat(), SITE_URL, start_str, end_str, "12M GSC extraction run; append manual SEO/release events here."]],
    )

    write_csv(p("00_GSC_16_TO_30_MANIFEST.csv"), manifest[0], manifest[1:])
    print("\nFinished #16-#30 inside:", OUT_DIR)


if __name__ == "__main__":
    main()
```

---

## gsc_07_finish_19_21_24.py

```python
import csv
import datetime
import os
import socket
import time
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

socket.setdefaulttimeout(60)

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
TOKEN_FILE = "gsc_token.json"
SITE_URL = "sc-domain:example.com"
OUT_DIR = os.path.join(os.getcwd(), "gsc_30_datasets_12m_example")
ROW_LIMIT = 25000
MAX_URL_INSPECTIONS = 250


def get_service():
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
        else:
            raise RuntimeError("Invalid gsc_token.json")
    return build("searchconsole", "v1", credentials=creds)


def write_csv(filepath, headers, rows_data):
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows_data)


def export_19_discover(service, start_dt, end_dt, out_path):
    out_rows = []
    cur = start_dt
    while cur <= end_dt:
        c_end = min(cur + datetime.timedelta(days=29), end_dt)
        c_start = cur.strftime("%Y-%m-%d")
        c_end_str = c_end.strftime("%Y-%m-%d")
        start_row = 0
        while True:
            body = {
                "startDate": c_start,
                "endDate": c_end_str,
                "dimensions": ["date", "page", "country"],
                "type": "discover",
                "rowLimit": ROW_LIMIT,
                "startRow": start_row,
                "dataState": "final",
            }
            resp = service.searchanalytics().query(siteUrl=SITE_URL, body=body).execute()
            rows = resp.get("rows", [])
            if not rows:
                break
            for r in rows:
                k = r["keys"]
                out_rows.append([
                    k[0], k[1], k[2],
                    r.get("clicks", 0),
                    r.get("impressions", 0),
                    round(r.get("ctr", 0.0), 6),
                ])
            if len(rows) < ROW_LIMIT:
                break
            start_row += ROW_LIMIT
        cur = c_end + datetime.timedelta(days=1)

    write_csv(out_path, ["date", "page_url", "country", "clicks", "impressions", "ctr"], out_rows)
    print(f"[OK] #19 Google Discover Performance -> {len(out_rows)} rows")


def inspect_with_retry(service, url, retries=2):
    for attempt in range(retries + 1):
        try:
            resp = service.urlInspection().index().inspect(
                body={"inspectionUrl": url, "siteUrl": SITE_URL}
            ).execute()
            return resp.get("inspectionResult", {}).get("indexStatusResult", {}), ""
        except Exception as exc:
            if attempt < retries:
                time.sleep(1.5)
            else:
                return {}, str(exc)


def export_21_and_24(service, out_dir):
    pages_file = os.path.join(out_dir, "03_landing_page_performance.csv")
    page_totals = {}
    if os.path.exists(pages_file):
        with open(pages_file, "r", encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                u = row.get("page_url", "")
                impr = int(float(row.get("impressions") or 0))
                if u:
                    page_totals[u] = page_totals.get(u, 0) + impr

    ranked_urls = [
        u for u, _ in sorted(page_totals.items(), key=lambda x: x[1], reverse=True)
    ][:MAX_URL_INSPECTIONS]

    rows_21 = []
    rows_24 = []
    ok_count = 0
    err_count = 0

    for i, url in enumerate(ranked_urls, 1):
        idx, err = inspect_with_retry(service, url)
        is_https = url.lower().startswith("https://")
        if err:
            err_count += 1
            rows_21.append([url, "ERROR", "", "", "", "", "", "", "", err])
            rows_24.append([url, is_https, "ERROR", "ERROR"])
        else:
            ok_count += 1
            verdict = idx.get("verdict", "")
            fetch_state = idx.get("pageFetchState", "")
            rows_21.append([
                url,
                verdict,
                idx.get("coverageState", ""),
                idx.get("indexingState", ""),
                idx.get("robotsTxtState", ""),
                idx.get("lastCrawlTime", ""),
                fetch_state,
                idx.get("googleCanonical", ""),
                idx.get("userCanonical", ""),
                "",
            ])
            rows_24.append([url, is_https, fetch_state, verdict])

        if i % 50 == 0:
            print(f"     Inspected {i}/{len(ranked_urls)} URLs (ok={ok_count}, err={err_count})...")

    write_csv(
        os.path.join(out_dir, "21_indexing_and_coverage.csv"),
        [
            "page_url", "verdict", "coverage_state", "indexing_state",
            "robots_txt_state", "last_crawl_time", "page_fetch_state",
            "google_canonical", "user_canonical", "error"
        ],
        rows_21,
    )
    print(f"[OK] #21 Indexing and Coverage -> {len(rows_21)} rows (ok={ok_count}, err={err_count})")

    write_csv(
        os.path.join(out_dir, "24_https_status.csv"),
        ["page_url", "is_https", "page_fetch_state", "verdict"],
        rows_24,
    )
    print(f"[OK] #24 HTTPS Status -> {len(rows_24)} rows")


def main():
    service = get_service()
    end_dt = datetime.date.today() - datetime.timedelta(days=3)
    start_dt = end_dt - datetime.timedelta(days=365)

    export_19_discover(service, start_dt, end_dt, os.path.join(OUT_DIR, "19_google_discover_performance.csv"))
    export_21_and_24(service, OUT_DIR)
    print("\nFinished patching #19, #21, and #24 inside:", OUT_DIR)


if __name__ == "__main__":
    main()
```
