json.array!(@videos) do |video|
  json.extract! video, :id, :title, :time, :lat, :lng, :hash_tags, :s3_key
  json.url video_url(video, format: :json)
end
