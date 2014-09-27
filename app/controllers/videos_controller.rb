class VideosController < ApplicationController
  before_action :set_video, only: [:show, :edit, :update, :destroy]
  @@AWS_S3_BUCKET = ENV['AWS_S3_BUCKET']
  @@AWS_S3_URL = 'http://' + @@AWS_S3_BUCKET + '.s3.amazonaws.com'
  @@AWS_ACCESS_KEY_ID = ENV['AWS_ACCESS_KEY_ID']
  @@AWS_SECRET_ACCESS_KEY_ID = ENV['AWS_SECRET_ACCESS_KEY_ID']
  @@MIN_FILE_SIZE_MB = 0
  @@MAX_FILE_SIZE_MB = 20

  # GET /videos
  # GET /videos.json
  def index
    @aws_s3_url = @@AWS_S3_URL
    @aws_post_url = @@AWS_S3_URL
    @aws_access_key_id = @@AWS_ACCESS_KEY_ID
    @video = Video.new({title: "Title with hashtags"})
  end

  def geosearch
    # TODO(danj): make these safe params
    c = params['coordinates']
    video_list = Video.geosearch(c['latLow'], c['latUp'],
                                 c['lngLow'], c['lngUp'])
    render json: video_list.to_json(:include => :hash_tags)
  end

  # GET /videos/1
  # GET /videos/1.json
  def show
    @aws_s3_url = @@AWS_S3_URL
  end

  def presign
    # TODO(danj): make these safe params
    @s3_key = Time.now.to_i.to_s + '_' + params['video']['filename']
    render json: {
      policy: s3_upload_policy_document,
      signature: s3_upload_signature,
      key: @s3_key
    }
  end

  # GET /videos/new
  def new
    @aws_post_url = @@AWS_S3_URL
    @aws_access_key_id = @@AWS_ACCESS_KEY_ID
    @video = Video.new({title: "Title with hashtags"})
  end

  # GET /videos/1/edit
  def edit
  end

  # POST /videos
  # POST /videos.json
  def create
    @video = Video.new(video_params)
    @video.hash_tags = extract_hash_tags(@video.title)

    respond_to do |format|
      if @video.save
        flash[:notice] = 'Radical!'
        # format.html { redirect_to @video, notice: 'Radical!' }
        # format.json { render :show, status: :created, location: @video }
      else
        flash[:notice] = 'Oh no! Something went wrong homie!'
        # format.html { render :new }
        # format.json { render json: @video.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /videos/1
  # PATCH/PUT /videos/1.json
  def update
    @video.hash_tags = extract_hash_tags(@video.title)

    respond_to do |format|
      if @video.update(video_params)
        format.html { redirect_to @video, notice: 'Video was successfully updated.' }
        format.json { render :show, status: :ok, location: @video }
      else
        format.html { render :edit }
        format.json { render json: @video.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /videos/1
  # DELETE /videos/1.json
  def destroy
    @video.destroy
    respond_to do |format|
      format.html { redirect_to videos_url, notice: 'Video was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_video
      @video = Video.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def video_params
      params.require(:video).permit(:title, :recorded_at, :lat, :lng, :s3_key)
    end

    def extract_hash_tags(s)
      (s.scan(/#(\w+\b)/).flatten).collect { |tag| HashTag.new(name: tag) }
    end

    def s3_upload_policy_document
      return @policy if @policy
      min_bits = mb_to_bits(@@MIN_FILE_SIZE_MB)
      max_bits = mb_to_bits(@@MAX_FILE_SIZE_MB)
      ret = {'expiration' => 5.minutes.from_now.utc.xmlschema,
             'conditions' => [
               {'bucket' => @@AWS_S3_BUCKET},
               ['starts-with', '$key', @s3_key],
               {'acl' => 'public-read'},
               {'success_action_status' => '200'},
               ['content-length-range', min_bits, max_bits]
            ]
      }
      @policy = Base64.encode64(ret.to_json).gsub(/\n/,'')
    end

    def mb_to_bits(mb)
      mb * 8 * 10**6
    end

    def s3_upload_signature
      signature = Base64.encode64(OpenSSL::HMAC.digest(OpenSSL::Digest::Digest.new('sha1'),
                                  @@AWS_SECRET_ACCESS_KEY_ID,
                                  s3_upload_policy_document)).gsub("\n","")
      signature
    end

end
